import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' }
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // ★ 토큰이 존재하고, 'null' 문자열이 아닐 때만 헤더 추가
        if (token && token !== 'null' && token !== 'undefined') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;