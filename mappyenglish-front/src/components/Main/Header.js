import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import { useAuth } from '../pages/AuthContext';

function Header(){
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        alert("로그아웃 되었습니다.");
        navigate('/');
    };

    return (
        <header className='mappyHeader'>
            <div className="safe-padded" style={{
                padding: '0px 20px', // 상하 여백 균일하게 유지
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                // height는 내용물에 따라 자동으로 잡히도록 설정 (고정값 삭제)
            }}>
                {/* 로고 영역 */}
                <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/">
                        <img src="/MappyLogo.png" alt="Mappy English"
                            style={{ height: '85px', display: 'block' }} // 로고도 45px -> 40px로 축소
                        />
                    </Link>
                </div>

                {/* 우측 상단 아이콘 버튼 영역 */}
                <div className="header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            {/* 1. 내 정보 (크기 축소) */}
                            <button
                                onClick={() => navigate('/my-info')}
                                style={circleBtnStyle}
                                title="내 정보"
                            >
                                {/* 아이콘 22px -> 18px 축소 */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </button>

                            {/* 2. 로그아웃 (크기 축소) */}
                            <button
                                onClick={handleLogout}
                                style={{...circleBtnStyle, color: '#FF5252', backgroundColor: '#FFEBEE'}}
                                title="로그아웃"
                            >
                                {/* 아이콘 22px -> 18px 축소 */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
                                </svg>
                            </button>
                        </>
                    ) : (
                        /* 3. 로그인 버튼 (크기 및 폰트 축소) */
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                ...circleBtnStyle,
                                color: '#4285F4',
                                backgroundColor: '#E3F2FD',
                                width: 'auto',
                                height: '30px',       // 34px -> 30px 축소
                                padding: '0 12px',    // 패딩 축소
                                borderRadius: '15px', // 높이의 절반
                                gap: '5px',
                                fontWeight: 'bold'
                            }}
                            title="로그인"
                        >
                            {/* 아이콘 20px -> 16px 축소 */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                            </svg>
                            {/* 폰트 13px -> 12px 축소 */}
                            <span style={{fontSize: '12px', lineHeight: 1}}>로그인</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

// ✅ 동그란 버튼 스타일 (더 작게 수정됨)
const circleBtnStyle = {
    width: '30px',  // 34px -> 30px 로 축소
    height: '30px', // 34px -> 30px 로 축소
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#555',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', // 그림자 더 은은하게
    padding: 0
};

export default Header;