import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // 핵심!
import BottomBar from './Main/BottomBar';
import PostCard from './PostCard';
import PostSearch from './PostSearch';

const Layout = () => {
  // 상태: 'search' | 'saved' | null (null이면 닫힘)
  const [activeSheet, setActiveSheet] = useState(null);

  // 시트 닫기 (지도로 돌아가기)
  const closeAllSheets = () => setActiveSheet(null);

  // 시트 열기 핸들러들
  const openSearch = () => setActiveSheet('search');
  const openSaved = () => setActiveSheet('saved');

  return (
    <div className="app-layout">
      {/* <Outlet />은 React Router가 "현재 주소에 맞는 페이지(PostMain 등)"를
         갈아 끼워주는 구멍 역할을 합니다.
      */}
      <div className="content-area">
         <Outlet />
      </div>

      {/* 바텀바에 상태와 핸들러를 모두 넘겨줍니다 */}
      <BottomBar
        activeSheet={activeSheet}
        onOpenSearch={openSearch}
        onOpenSaved={openSaved}
        onCloseAll={closeAllSheets}
      />

      {/* 검색 시트 */}
      <PostSearch
        isOpen={activeSheet === 'search'}
        onClose={closeAllSheets}
      />

      {/* 저장 시트 */}
      <PostCard
        isOpen={activeSheet === 'saved'}
        onClose={closeAllSheets}
      />
    </div>
  );
};

export default Layout;
