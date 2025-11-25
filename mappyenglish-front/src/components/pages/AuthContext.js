import React, { createContext, useState, useContext } from 'react';
import api from './axiosConfig'; // 위에서 만든 파일 import

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    // localStorage에 토큰 있으면 true, 없으면 false
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });

            // 백엔드에서 받은 토큰 저장 (Key값: accessToken 이라고 가정)
            const token = response.data.accessToken || response.data.token;

            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            return true; // 성공
        } catch (error) {
            console.error("로그인 에러:", error);
            alert("이메일 또는 비밀번호가 틀렸습니다.");
            return false; // 실패
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;

export const useAuth = () => useContext(AuthContext);