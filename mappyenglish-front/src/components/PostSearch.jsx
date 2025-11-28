// src/components/SearchBottomSheet.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동용
import axios from 'axios'; // API 호출용
import { Search, X, XCircle, ShoppingBag, MapPin, MessageCircle, ArrowDownRight, Camera, Coffee, Map} from 'lucide-react';
import '../css/PostCard.css'; // 기존 시트 CSS 재사용 (통일감)
import '../css/PostSearch.css';

function PostSearch({ isOpen, onClose }) {
  const navigate = useNavigate();

  // ★ 카테고리 데이터 수정 (keyword 대신 code 사용)
  const categories = [
    {
      id: 'tour',
      label: '관광 명소',
      code: 'A', // DB에 저장된 값
      icon: <Camera size={20} color="#3B82F6" />,
      bg: '#EFF6FF'
    },
    {
      id: 'cafe',
      label: '카페 주문',
      code: 'B',
      icon: <Coffee size={20} color="#F97316" />,
      bg: '#FFF7ED'
    },
    {
      id: 'shopping',
      label: '쇼핑/계산',
      code: 'C',
      icon: <ShoppingBag size={20} color="#10B981" />,
      bg: '#ECFDF5'
    },
    {
      id: 'directions',
      label: '길 묻기',
      code: 'D',
      icon: <Map size={20} color="#8B5CF6" />,
      bg: '#F5F3FF'
    },
  ];

  // ★ 카테고리 클릭 핸들러 (로직 변경됨)
  const handleCategoryClick = async (categoryCode, categoryLabel) => {
      // 1. 검색창에 텍스트 표시 (사용자가 뭘 눌렀는지 알게 함)
      setSearchText(categoryLabel);

      try {
          // 2. 카테고리 전용 API 호출
          const response = await axios.get(`/api/conversations/category`, {
              params: { code: categoryCode }
          });

          // 3. 결과 세팅 (장소는 없고, 대화만 있음)
          setSearchResult({
              places: [], // 카테고리 검색은 장소 결과는 없으므로 빈 배열
              conversations: response.data
          });

          setIsSearched(true); // 결과 화면으로 전환

      } catch (error) {
          console.error("카테고리 조회 실패:", error);
      }
  };

  // ★ 검색 가이드 데이터 (입력 예시 -> 기대 결과)
  const searchGuides = [
    {
      keyword: '사진',
      preview: '개선문을 배경으로 사진 한 장만 찍어주시겠어요?',
      type: 'conv', // 회화
      id: 10 // 예시 ID (클릭 시 이동용)
    },
    {
      keyword: '화장실',
      preview: '이 근처에 무료 공중화장실이 있나요?',
      type: 'conv',
      id: 15
    },
    {
      keyword: '에펠탑',
      preview: '에펠탑 (장소)',
      type: 'place', // 장소
      id: 1
    }
  ];
  // 가이드 클릭 시 바로 검색 실행하는 함수
  const handleGuideClick = (keyword) => {
      setSearchText(keyword);
      // 바로 검색 API를 호출하려면 여기서 handleSearch()를 약간 수정해서 호출하거나
      // 단순히 텍스트만 채워주고 사용자가 엔터 치게 할 수도 있음.
      // 여기서는 텍스트 채우기 + 바로 검색 실행 로직을 추천

      // (비동기 state 문제 때문에 별도 함수 분리 혹은 axios 직접 호출 추천)
      axios.get(`/api/places/search`, { params: { query: keyword } })
        .then(res => {
            setSearchResult(res.data);
            setIsSearched(true);
        });
  };
  // 1. 상태 관리
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState({ places: [], conversations: [] });
  const [isSearched, setIsSearched] = useState(false);

  // 2. 검색 실행 함수 (백엔드 호출)
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      const response = await axios.get(`/api/places/search`, {
        params: { query: searchText }
      });
      // 백엔드에서 { places: [...], conversations: [...] } 형태로 옴
      setSearchResult(response.data);
      setIsSearched(true);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  // 3. 엔터키 감지 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ★ 4. 입력창 내부 X버튼: 텍스트만 지우고 '추천 카테고리' 화면으로 복귀
  const handleClearInput = () => {
    setSearchText('');
    setSearchResult({ places: [], conversations: [] });
    setIsSearched(false);
    // (선택) 지운 후 입력창에 다시 포커스를 주고 싶으면 ref 사용
  };

  // ★ 5. 시트 닫기: 모든 상태 초기화 후 닫기
  const handleClearAll = () => {
      setSearchText('');
      setSearchResult({ places: [], conversations: [] });
      setIsSearched(false);
  };

  // 6. 닫기 버튼 (완전 종료)
  const handleCloseSheet = () => {
      setSearchText('');
      setSearchResult({ places: [], conversations: [] });
      setIsSearched(false);
      handleClearAll();
      onClose();
  };

//  const handleDeleteRecent = (targetIndex) => {
//    setRecentSearches(prev => prev.filter((_, idx) => idx !== targetIndex));
//  };

  if (!isOpen) return null;

  const totalCount = searchResult.places.length + searchResult.conversations.length;

  // ID에 따른 도시 경로 반환 함수
  const getRouteByPlaceId = (id) => {
      const placeId = Number(id);
      if (placeId >= 1 && placeId <= 52) return `/paris/${placeId}`;
      if (placeId >= 53 && placeId <= 82) return `/london/${placeId}`;
      if (placeId >= 84 && placeId <= 99) return `/nice/${placeId}`;
      if (placeId >= 100 && placeId <= 118) return `/edinburgh/${placeId}`;

      // 예외 처리 (범위 밖이면 일단 파리로 보내거나 에러 처리)
      return `/paris/${placeId}`;
  };

  return (
    <div className="sheet-overlay" onClick={handleCloseSheet}>
      <div className="sheet-container" onClick={(e) => e.stopPropagation()}>

        {/* 1. 검색 헤더 (입력창 형태) */}
        <header className="search-header">
          <div className="search-input-wrapper">
            <Search size={20} color="#9CA3AF" />
            <input
                type="text"
                placeholder="상황이나 장소를 검색하세요 (예: 카페)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown} // ★ 엔터키 이벤트 연결
                autoFocus
            />
            {/* ★ 수정됨: 텍스트가 있을 때만 '지우기(XCircle)' 버튼 표시 */}
            {searchText.length > 0 && (
                <button className="input-clear-btn" onClick={handleClearInput}>
                    <XCircle size={18} color="#9CA3AF" fill="#E5E7EB" />
                </button>
            )}
          </div>
          {/* X 버튼: 입력 내용이 있으면 '지우기', 없으면 '닫기' 처럼 동작하게 커스텀 가능 */}
          <button className="close-icon-btn" onClick={handleCloseSheet}>
            <X size={24} color="#374151" />
          </button>
        </header>

        <div className="sheet-content">
            {/* ★ 조건부 렌더링: 검색을 실행했으면 '결과창', 안했으면 '추천창' */}
            {isSearched ? (
                <div className="search-results-area">
                    <h3 className="section-title">검색 결과 ({totalCount})</h3>

                    {totalCount === 0 ? (
                        <p className="no-result-msg">검색 결과가 없습니다.</p>
                    ) : (
                        <ul className="result-list">

                            {/* 1. 장소 검색 결과 렌더링 */}
                            {searchResult.places.map((place) => (
                                <li key={`place-${place.id}`} className="result-item" onClick={() => {
                                    navigate(getRouteByPlaceId(place.id)); // ★ 스마트 라우팅
                                    handleCloseSheet();
                                }}>
                                    <div className="result-icon-box place-icon">
                                        <MapPin size={20} color="#fff" />
                                    </div>
                                    <div className="result-info">
                                        <span className="result-name">{place.name}</span>
                                        <span className="result-sub-text">장소 바로가기</span>
                                    </div>
                                </li>
                            ))}

                            {/* 2. 대화 검색 결과 렌더링 */}
                            {searchResult.conversations.map((conv, idx) => (
                                <li key={`conv-${idx}`} className="result-item" onClick={() => {
                                    navigate(getRouteByPlaceId(conv.placeId)); // ★ 스마트 라우팅
                                    handleCloseSheet();
                                }}>
                                    <div className="result-icon-box conv-icon">
                                        <MessageCircle size={20} color="#fff" />
                                    </div>
                                    <div className="result-info">
                                        {/* 한글 해석 (검색된 키워드) */}
                                        <span className="result-name">{conv.koreanText1}</span>
                                        {/* 영어 원문 + 장소 이름 */}
                                        <span className="result-sub-text">
                                            {conv.englishText1} · {conv.placeName}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <>
                    <section className="section-block">
                        <h3 className="section-title">추천 카테고리</h3>
                        <div className="category-grid">
                            {/* ... 기존 카테고리 맵핑 ... */}
                            {categories.map((cat) => (
                                <button key={cat.id} className="category-item" onClick={() => {
                                    handleCategoryClick(cat.code, cat.label); // 버튼 누르면 검색창에 입력
                                    // 바로 검색하고 싶으면 handleSearch() 호출 가능
                                }}>
                                    <div className="cat-icon-box" style={{ backgroundColor: cat.bg }}>
                                        {cat.icon}
                                    </div>
                                    <span className="cat-label">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                  {/* ★ 2. 검색 가이드 (새로 추가된 부분) */}
                  <section className="section-block">
                    <h3 className="section-title">이렇게 검색해보세요</h3>
                    <div className="guide-list">
                        {searchGuides.map((guide, idx) => (
                            <button
                                key={idx}
                                className="guide-card"
                                onClick={() => handleGuideClick(guide.keyword)}
                            >
                                {/* 상단: 입력 예시 */}
                                <div className="guide-header">
                                    <span className="search-label">검색</span>
                                    <span className="guide-keyword">"{guide.keyword}"</span>
                                </div>

                                {/* 연결선 */}
                                <div className="guide-connector">
                                    <ArrowDownRight size={16} color="#9CA3AF" />
                                </div>

                                {/* 하단: 결과 미리보기 (실제 결과처럼 스타일링) */}
                                <div className="guide-preview-box">
                                    <div className={`preview-icon ${guide.type === 'place' ? 'place-icon' : 'conv-icon'}`}>
                                        {guide.type === 'place' ? <MapPin size={14} color="#fff"/> : <MessageCircle size={14} color="#fff"/>}
                                    </div>
                                    <span className="preview-text">{guide.preview}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                  </section>
                </>
            )}
        </div>
      </div>
    </div>
  );
}

export default PostSearch;