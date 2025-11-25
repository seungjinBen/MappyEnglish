import React, { useState } from 'react';
import api from './axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // ★ CSS 파일 연결

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/register', {
                email: email,
                password: password,
                username: username
            });

            console.log(response.data);
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            navigate('/login');

        } catch (error) {
            console.error('회원가입 실패:', error);
            alert(error.response?.data || '회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-card">
                <h2 className="register-title">회원가입</h2>
                <p className="register-subtitle">Mappy English의 회원이 되어보세요!</p>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <label className="input-label">이름</label>
                        <input
                            className="register-input"
                            type="text"
                            placeholder="사용하실 이름을 입력하세요"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">이메일</label>
                        <input
                            className="register-input"
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
                            className="register-input"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="register-btn">
                        가입하기
                    </button>
                </form>

                {/* 이미 계정이 있는 경우 로그인으로 돌아가기 */}
                <div className="login-link-container">
                    이미 계정이 있으신가요?
                    <Link to="/login" className="login-link">
                        로그인 하기
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;