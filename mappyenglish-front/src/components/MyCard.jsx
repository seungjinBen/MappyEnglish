import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyCard() {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedConversations = async () => {
      // 1. 토큰 가져오기
      const token = localStorage.getItem('token');

      // 토큰이 없으면 "로그인해주세요" 처리 (여기선 그냥 리턴)
      if (!token) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        // 2. 헤더에 토큰 실어서 보내기
        const response = await axios.get(`/api/bookmarks/my`, {
          headers: {
            Authorization: `Bearer ${token}` // ★ 핵심: 신분증 지참!
          }
        });

        setSavedList(response.data);
      } catch (error) {
        console.error("목록 불러오기 실패:", error);
        if (error.response && error.response.status === 403) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedConversations();
  }, []); // 의존성 배열 비움 (한 번만 실행)

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📂 내가 저장한 대화 카드</h2>

      {savedList.length === 0 ? (
        <p>아직 저장한 대화가 없습니다.</p>
      ) : (
        <div style={gridStyle}>
          {savedList.map((item) => (
            <div key={item.savedId} style={cardStyle}>
              {/* 장소 이름 */}
              <h3>📍 {item.placeName || "장소 정보 없음"}</h3>

              {/* 대화 내용 표시 */}
              <div style={dialogueBoxStyle}>
                <p><strong>A:</strong> {item.englishText1}</p>
                <p style={{ color: '#555', fontSize: '0.9em' }}>
                  ({item.koreanText1})
                </p>
              </div>

              {/* (추가 팁) 여기서 삭제 기능도 만들고 싶다면 BookmarkButton을 재활용하거나
                  별도의 삭제 버튼을 만들어 deleteSavedConversation API를 호출하면 됩니다. */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 스타일은 그대로 유지
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  marginTop: '20px'
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  backgroundColor: '#fff'
};

const dialogueBoxStyle = {
  backgroundColor: '#f9f9f9',
  padding: '10px',
  borderRadius: '5px',
  marginTop: '10px'
};

export default MyCard;