import './App.css';
import { Routes, Route } from 'react-router-dom'; // BrowserRouter 삭제함 (index.js에 있으니까)
import { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from './components/Layout'; // (확장자 .jsx 자동인식됨)
// --- 컴포넌트 Import ---
import PostMain from './components/PostMain';
import PostParis from './components/PostParis';
import PostLondon from './components/PostLondon';
import PostAbout from './components/PostAbout';
import PostCard from './components/PostCard'; // (확장자 .jsx 자동인식됨)

import BottomBar from './components/Main/BottomBar';
// --- 페이지 Import (파일 구조 사진 반영) ---
import ProtectedRoute from './components/pages/ProtectedRoute';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

function App() {
  const [placeList, setPlaceList] = useState([]);

  useEffect(() => {
    selectAll();
  }, []);

  const selectAll = async () => {
    try {
      const { data } = await axios.get('/api/places');
      setPlaceList(Array.isArray(data) ? data : (data?.content ?? []));
    } catch (e) {
      console.error(e);
    }
  };

  // 시트 열림 상태 관리
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="App">
      {/* ★★★ 여기에 BrowserRouter가 있으면 절대 안됨 (index.js에 있음) ★★★ */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Layout />}>
            {/* 2. 메인 및 도시 라우트 */}
            <Route path='/' element={<PostMain placeList={placeList} />} />
            <Route path='/paris' element={<PostParis placeList={placeList} />} />
            <Route path="/paris/:id" element={<PostParis placeList={placeList} />} />
            <Route path='/london' element={<PostLondon placeList={placeList} />} />
            <Route path="/london/:id" element={<PostLondon placeList={placeList} />} />
            <Route path='/about' element={<PostAbout placeList={placeList} />} />
        </Route>
        {/* 4. 404 페이지 (테스트용: 경로가 틀리면 이게 뜸) */}
        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
      <PostCard
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}

export default App;