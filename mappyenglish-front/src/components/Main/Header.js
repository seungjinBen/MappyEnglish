import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
// 경로는 본인 프로젝트 구조에 맞게 수정해주세요
import { useAuth } from '../pages/AuthContext';

function Header(){
    const { isLoggedIn, logout } = useAuth(); // AuthContext 사용
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // 토큰 삭제 및 상태 false 변경
        alert("로그아웃 되었습니다.");
        navigate('/'); // 메인으로 이동
    };

    return (
        <header className='mappyHeader'>
            <div className="safe-padded" style={{
                paddingTop: 'max(var(--space-4), env(safe-area-inset-top))',
                display: 'flex',            // Flexbox 사용
                justifyContent: 'space-between', // 양끝 정렬 (로고 왼쪽, 버튼 오른쪽)
                alignItems: 'center',       // 수직 중앙 정렬
                paddingRight: '20px'        // 오른쪽 여백
            }}>
                {/* 로고 영역 */}
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                    <Link to="/">
                        <img src="/MappyLogo.png" alt="Mappy English Logo"
                            style={{ height: '100px', margin: '-30px 0 -30px 0', display: 'block' }}
                        />
                    </Link>
                </div>

                {/* 우측 상단 로그인/로그아웃/내정보 버튼 영역 */}
                <div className="header-actions" style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
                    {isLoggedIn ? (
                        <>
                            {/* 로그인 된 상태 */}
                            <button
                                onClick={() => navigate('/my-info')}
                                style={btnStyle}
                            >
                                내 정보
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{...btnStyle, backgroundColor: '#ff6b6b'}} // 로그아웃은 약간 붉은색
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        /* 로그인 안 된 상태 */
                        <button
                            onClick={() => navigate('/login')}
                            style={{...btnStyle, backgroundColor: '#4CAF50'}} // 로그인 버튼 초록색
                        >
                            로그인
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

// 간단한 버튼 스타일 (필요하면 CSS파일로 옮기세요)
const btnStyle = {
    padding: '8px 12px',
    borderRadius: '20px',
    border: 'none',
    color: 'white',
    backgroundColor: '#888',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.8rem'
};
export default Header;