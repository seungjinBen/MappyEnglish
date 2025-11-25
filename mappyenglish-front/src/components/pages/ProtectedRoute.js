import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute(){
    const { isLoggedIn } = useAuth(); // 1. 현재 로그인 상태 확인

    if (!isLoggedIn) {
        // 2. 로그인 안 했으면 -> 로그인 페이지로 강제 이동
        alert('로그인이 필요합니다.');
        return <Navigate to="/login" replace />;
    }

    // 3. 로그인 했으면 -> 자식 페이지(Outlet)를 보여줌
    return <Outlet />;
};

export default ProtectedRoute;