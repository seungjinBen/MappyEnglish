import React from 'react';
import '../../App.css';
import './BottomBar.css';
import { useAuth } from '../pages/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom'; // Link 대신 useNavigate 사용
import { Map, Search, BookOpen } from 'lucide-react';

function BottomBar({ activeSheet, onOpenSearch, onOpenSaved, onCloseAll }) {
    const location = useLocation();
    const navigate = useNavigate(); // 페이지 이동을 코드로 제어하기 위함
    const { isLoggedIn } = useAuth();

    // 시트 상태 확인
    const isSheetOpen = activeSheet !== null;
    const isSearchActive = activeSheet === 'search';
    const isSavedActive = activeSheet === 'saved';

    // 지도 탭 활성화 조건: 시트가 닫혀있으면 무조건 파란색 (어느 도시에 있든)
    const isMapActive = !isSheetOpen;

    // ★ 핵심 로직: 지도 버튼 클릭 핸들러
    const handleMapClick = () => {
        // 1. 시트가 열려 있다면? -> 시트만 닫고 끝 (페이지 이동 X)
        if (isSheetOpen) {
            if (onCloseAll) onCloseAll();
            return;
        }

        // 2. 시트가 닫혀 있는데, 현재 위치가 메인('/')이 아니라면? -> 메인으로 이동
        if (location.pathname !== '/') {
            navigate('/');
            return;
        }

        // 3. 이미 메인이고 시트도 없다면? -> (옵션) 새로고침 효과나 아무것도 안 함
        // window.scrollTo(0, 0); // 예: 지도 초기화 등
    };

    const handleSearchClick = () => {
        if (onOpenSearch) onOpenSearch();
    };

    const handleSavedClick = (e) => {
        if (!isLoggedIn) {
            if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?")) {
                navigate('/login');
            }
        } else {
            if (onOpenSaved) onOpenSaved();
        }
    };

    const getTextStyle = (active) => ({
        fontWeight: active ? 'bold' : '500',
    });

    return (
        <nav className='mappyBottom'>
            <div className="safe-padded">
                <div className="container bottom-nav">

                    {/* 1. 지도 (Link -> Button으로 변경하여 로직 제어) */}
                    <button
                        className={`btn ${isMapActive ? 'active' : ''}`}
                        onClick={handleMapClick}
                        type="button"
                    >
                        <Map size={20} strokeWidth={isMapActive ? 2.5 : 2} />
                        <span className="btn-text" style={getTextStyle(isMapActive)}>
                            {/* 현재 위치가 메인이 아니면 '전체 지도'라고 보여줄 수도 있지만,
                                보통 그냥 '지도'로 통일합니다. */}
                            지도
                        </span>
                    </button>

                    {/* 2. 검색 */}
                    <button
                        className={`btn ${isSearchActive ? 'active' : ''}`}
                        onClick={handleSearchClick}
                        type="button"
                    >
                        <Search size={20} strokeWidth={isSearchActive ? 2.5 : 2} />
                        <span className="btn-text" style={getTextStyle(isSearchActive)}>
                            검색
                        </span>
                    </button>

                    {/* 3. 내 회화노트 */}
                    <button
                      className={`btn ${isSavedActive ? 'active' : ''}`}
                      onClick={handleSavedClick}
                      type="button"
                    >
                        <BookOpen size={20} strokeWidth={isSavedActive ? 2.5 : 2} />
                        <span className="btn-text" style={getTextStyle(isSavedActive)}>
                          저장됨
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default BottomBar;