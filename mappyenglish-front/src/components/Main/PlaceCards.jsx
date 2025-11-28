import React, { useState, useEffect } from 'react'; // React Hook 추가
import axios from 'axios'; // API 호출용
import './PlaceCards.css';
import ConvCards from './ConvCards';
import MediaCarousel from './MediaCarousel';

export default function PlaceCards({ conversations = [], selectedPlace = {} }) {

    // 1. 내가 저장한 대화 ID들을 담을 상태 (빠른 검색을 위해 Set 사용)
    const [myBookmarkedIds, setMyBookmarkedIds] = useState(new Set());

    // 2. 컴포넌트가 로드될 때, "내 저장 목록" 가져오기
    useEffect(() => {
        const fetchMyBookmarks = async () => {
            const token = localStorage.getItem('token');
            if (!token) return; // 비로그인 상태면 패스

            try {
                // 내 북마크 목록 조회 API 호출
                const response = await axios.get('/api/bookmarks/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 받아온 목록에서 'conversationId'만 뽑아서 Set으로 변환
                // 예: [ {savedId:1, conversationId: 5}, ... ] -> Set { 5, ... }
                const ids = new Set(response.data.map(item => item.conversationId));
                setMyBookmarkedIds(ids);

            } catch (error) {
                console.error("북마크 목록 로드 실패:", error);
            }
        };

        fetchMyBookmarks();
    }, []); // 처음 한 번만 실행

    if (!conversations) return null;
    if (!selectedPlace) return null;

    // 3. 기존 conversations 데이터에 'isSaved' 정보를 합침
    const conversationsWithStatus = conversations.map(conv => ({
        ...conv,
        // 내 북마크 목록(Set)에 이 대화 ID가 있으면 true, 없으면 false
        isSaved: myBookmarkedIds.has(conv.id)
    }));


    // --- 기존 로직 (카테고리, 지도 URL 등) ---
    const CATEGORY_LABELS = {
      A: '관광명소',
      B: '음식점',
      C: '상점',
      D: '대중교통',
      E: '기타시설',
    };

    const { id, name, category, lat, lng, description, imgUrl } = selectedPlace;
    const catLabel = CATEGORY_LABELS[(category ?? '').toUpperCase()] ?? '분류없음';

    const getGoogleMapUrl = () => {
        const query = encodeURIComponent(name);
        return `https://www.google.com/maps/search/?api=1&query=${query}`; // URL은 사용하시던 것 유지
    };

    return (
      <section className="card-container">
        <div className="container cq">
          {/* ... (상단 카드 UI는 기존 코드와 완벽히 동일하여 생략하지 않고 그대로 둡니다) ... */}
          <div className="card-grid mq-2col">
            <article className="card shadow-soft">
              <div style={{display:'flex', margin: '0 0 10px 5px',
              alignItems:'center', justifyContent:'space-between', gap:8}}>
                <h3 className="card-title" style={{marginBottom: 0}}>
                  {name ?? '이름 없음'}
                </h3>
                {category && <span className="chip-pill">{catLabel}</span>}
              </div>

              <MediaCarousel
                placeId={id}
                placeName={name}
                fallbackSrc={imgUrl}
              />

              {description && (
              <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#333333',
                    margin: '6px',
                    wordBreak: 'keep-all',
                    letterSpacing: '-0.3px'
                  }}>
                  {description}
              </p>
              )}

              <ul className="meta-list">
                  <li>
                    <span className="meta-key">운영 시간</span>
                    <span className="meta-val">넣어, 말아..</span>
                  </li>
                  <li>
                    <span className="meta-key">근처 명소</span>
                    <span className="meta-val">데이터 어떻게 넣지.. ai?</span>
                  </li>
                {id != null && (
                  <li>
                    <span className="meta-key">ID</span>
                    <span className="meta-val">#{id}</span>
                  </li>
                )}
              </ul>

              {name && (
                <div style={{display:'flex', gap:8, marginTop:8}}>
                  <a
                    className="btn-outline"
                    href={getGoogleMapUrl()}
                    target="_blank" rel="noreferrer"
                  >
                    구글지도 열기
                  </a>
                </div>
              )}
            </article>
          </div>
        </div>

        {/* ★ 핵심 변경 사항 ★
            기존 conversations 대신, isSaved가 합쳐진 데이터를 넘깁니다.
        */}
        <ConvCards conversations={conversationsWithStatus}/>
      </section>
    );
}