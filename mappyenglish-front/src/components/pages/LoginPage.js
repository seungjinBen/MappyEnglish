import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 경로 확인 필요: src/components/pages/LoginPage.js 위치 기준
import { useAuth } from './AuthContext';
import './LoginPage.css'; // ★ CSS 파일 import

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [countdown, setCountdown] = useState(3);

    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    // 1. 이미 로그인 상태라면 카운트다운 시작
    useEffect(() => {
        if (isLoggedIn) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            if (countdown === 0) {
                clearInterval(timer);
                navigate('/');
            }

            return () => clearInterval(timer);
        }
    }, [isLoggedIn, countdown, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isSuccess = await login(email, password);
        if (isSuccess) {
            navigate('/');
        }
    };

    // 2. 로그인 상태일 때 보여줄 화면
    if (isLoggedIn) {
        return (
            <div className="login-page-container">
                <div className="login-card">
                    <div className="icon-wrapper">✅</div>
                    <h2 className="login-title">이미 로그인 상태입니다</h2>
                    <p className="info-text">
                        <span className="highlight-text">{countdown}초</span> 뒤에 메인 페이지로 이동합니다.
                    </p>
                    <button onClick={() => navigate('/')} className="secondary-btn">
                        지금 바로 이동하기
                    </button>
                </div>
            </div>
        );
    }

    // 3. 로그인 폼 화면
    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2 className="login-title">로그인</h2>
                <p className="login-subtitle">나만의 회화 노트를 만들어보세요!</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label className="input-label">이메일</label>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">비밀번호</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        로그인
                    </button>
                </form>

                {/* 구분선 */}
                <div className="divider">
                    <span className="divider-text">또는</span>
                </div>

                {/* 회원가입 버튼 영역 */}
                <div className="register-container">
                    <p className="register-text">아직 계정이 없으신가요?</p>
                    <Link to="/register" className="register-link">
                        회원가입 하러가기
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;