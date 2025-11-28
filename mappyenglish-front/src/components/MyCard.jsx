import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BottomBar from './Main/BottomBar';
// Trash2 아이콘 추가 (삭제 버튼용)
import { Bookmark, Volume2, Plane, Utensils, MapPin, Trash2 } from 'lucide-react';
import '../css/MyCard.css';

function MyCard() {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 목록 불러오기 (기존 코드 유지)
  useEffect(() => {
    const fetchSavedConversations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/bookmarks/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedList(response.data);
      } catch (error) {
        console.error("목록 로드 실패:", error);
        if (error.response && error.response.status === 403) {
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSavedConversations();
  }, [navigate]);

  // ★ 삭제 핸들러 추가
  const handleDelete = async (conversationId) => {
    // 실수 방지를 위해 확인 창 띄우기
    if (!window.confirm("정말 이 대화 카드를 삭제하시겠습니까?")) return;

    const token = localStorage.getItem('token');
    try {
      // DELETE 요청 보내기
      await axios.delete(`/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { conversationId: conversationId } // 삭제할 ID 전달
      });

      // 성공 시, 화면 목록에서 즉시 제거 (새로고침 없이)
      setSavedList((prevList) =>
        prevList.filter((item) => item.conversationId !== conversationId)
      );

      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
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
    if (name.includes('airport') || name.includes('flight')) {
      return { color: '#3B82F6', bg: '#EFF6FF', icon: <Plane size={14} /> };
    } else if (name.includes('bistro') || name.includes('restaurant') || name.includes('cafe')) {
      return { color: '#F97316', bg: '#FFF7ED', icon: <Utensils size={14} /> };
    } else {
      return { color: '#10B981', bg: '#ECFDF5', icon: <MapPin size={14} /> };
    }
  };

  if (loading) return <div className="loading-screen">로딩 중...</div>;

  return (
    <div className="my-card-page">
      <header className="my-header">
        <div className="header-top">
          <h1 className="page-title">나의 노트</h1>
          <span className="save-count">{savedList.length}개 저장됨</span>
        </div>
        <p className="header-desc">여행 중 저장한 표현을 오프라인에서도 확인하세요.</p>
      </header>

      <main className="card-list-container">
        {savedList.length === 0 ? (
          <div className="empty-state"><p>아직 저장한 대화가 없습니다.</p></div>
        ) : (
          <div className="card-grid">
            {savedList.map((item) => {
              const { color, bg, icon } = getPlaceStyle(item.placeName);

              const dialogues = [];
              for(let i = 1; i <= 5; i++) {
                 const en = item[`englishText${i}`];
                 const ko = item[`koreanText${i}`];
                 if(en && en.trim() !== "") {
                     dialogues.push({ id: i, en, ko });
                 }
              }

              return (
                <div key={item.savedId} className="conversation-card">
                  <div className="color-bar" style={{ backgroundColor: color }}></div>
                  <div className="card-content">

                    <div className="card-top-row">
                      <span className="place-tag" style={{ color: color, backgroundColor: bg }}>
                        {icon} {item.placeName || "Unknown Place"}
                      </span>

                      {/* ★ 수정됨: 기존 Bookmark 아이콘 대신 삭제 버튼 추가 */}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.conversationId)}
                        aria-label="삭제하기"
                      >
                        <Trash2 size={20} color="#EF4444" /> {/* 빨간색 쓰레기통 */}
                      </button>
                    </div>

                    <div className="dialogue-area">
                      {dialogues.map((line) => (
                        <div key={line.id} className="dialogue-row">
                          <div className="dialogue-text-group">
                             <h3 className="english-text">{line.en}</h3>
                             <p className="korean-text">{line.ko}</p>
                          </div>

                          <button
                            className="speak-btn-mini"
                            onClick={() => handleSpeak(line.en)}
                            aria-label="듣기"
                          >
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
      </main>

      <BottomBar />
    </div>
  );
}

export default MyCard;