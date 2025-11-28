import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bookmark, Volume2, Plane, Utensils, MapPin, Trash2, X } from 'lucide-react'; // X 아이콘 추가
import '../css/PostCard.css';
import BottomBar from './Main/BottomBar';

// props로 isOpen(열림상태), onClose(닫기함수)를 받습니다.
function PostCard({ isOpen, onClose }) {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);



  // 시트가 열릴 때(isOpen이 true가 될 때)마다 데이터를 새로 가져옵니다.
  useEffect(() => {
    if (isOpen) {
      fetchSavedConversations();
    }
  }, [isOpen]);

  const fetchSavedConversations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/bookmarks/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedList(response.data);
    } catch (error) {
      console.error("목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conversationId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { conversationId }
      });
      setSavedList((prev) => prev.filter((item) => item.conversationId !== conversationId));
    } catch (error) {
      alert("삭제 실패");
    }
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const getPlaceStyle = (placeName) => {
    const name = placeName ? placeName.toLowerCase() : "";
    if (name.includes('airport') || name.includes('flight')) return { color: '#3B82F6', bg: '#EFF6FF', icon: <Plane size={14} /> };
    if (name.includes('bistro') || name.includes('restaurant') || name.includes('cafe')) return { color: '#F97316', bg: '#FFF7ED', icon: <Utensils size={14} /> };
    return { color: '#10B981', bg: '#ECFDF5', icon: <MapPin size={14} /> };
  };

  // 닫혀있으면 렌더링하지 않음 (혹은 CSS로 숨김 처리 가능하지만, 조건부 렌더링이 깔끔함)
  if (!isOpen) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      {/* 내부(e.stopPropagation)를 클릭해도 닫히지 않게 함 */}
      <div className="sheet-container" onClick={(e) => e.stopPropagation()}>

        {/* === 헤더 (X 버튼 포함) === */}
        <header className="sheet-header">
          <div className="header-left">
            <h2 className="sheet-title">나의 노트</h2>
            <span className="save-count">{savedList.length}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} color="#374151" />
          </button>
        </header>

        {/* === 콘텐츠 영역 (기존 디자인 유지) === */}
        <div className="sheet-content">
          {loading ? (
            <div className="loading-state">로딩 중...</div>
          ) : savedList.length === 0 ? (
            <div className="empty-state">저장된 대화가 없습니다.</div>
          ) : (
            <div className="card-grid">
              {savedList.map((item) => {
                const { color, bg, icon } = getPlaceStyle(item.placeName);
                const dialogues = [];
                for(let i = 1; i <= 5; i++) {
                   const en = item[`englishText${i}`];
                   const ko = item[`koreanText${i}`];
                   if(en && en.trim() !== "") dialogues.push({ id: i, en, ko });
                }

                return (
                  <div key={item.savedId} className="conversation-card">
                    <div className="color-bar" style={{ backgroundColor: color }}></div>
                    <div className="card-content">
                      <div className="card-top-row">
                        <span className="place-tag" style={{ color: color, backgroundColor: bg }}>
                          {icon} {item.placeName || "Unknown"}
                        </span>
                        <button className="delete-btn" onClick={() => handleDelete(item.conversationId)}>
                          <Trash2 size={18} color="#EF4444" />
                        </button>
                      </div>
                      <div className="dialogue-area">
                        {dialogues.map((line) => (
                          <div key={line.id} className="dialogue-row">
                            <div className="dialogue-text-group">
                               <h3 className="english-text">{line.en}</h3>
                               <p className="korean-text">{line.ko}</p>
                            </div>
                            <button className="speak-btn-mini" onClick={() => handleSpeak(line.en)}>
                               <Volume2 size={18} color="#9CA3AF" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PostCard;