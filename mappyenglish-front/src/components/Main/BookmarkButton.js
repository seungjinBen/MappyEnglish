import React, { useState } from 'react';
import axios from 'axios';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const BookmarkButton = ({ conversationId, initialIsSaved }) => {
  // userId prop은 이제 필요 없습니다! (토큰에 들어있으니까요)
  const [isSaved, setIsSaved] = useState(initialIsSaved || false);

  const toggleSave = async () => {
    // 1. 저장된 토큰 가져오기 (로그인 시 저장한 키 이름 확인 필요!)
    const token = localStorage.getItem('token');

    if (!token) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // ★ 헤더에 토큰 첨부
        },
        params: { conversationId }
      };

      if (isSaved) {
        // 삭제 요청
        await axios.delete(`/api/bookmarks`, config);
        alert("저장이 취소되었습니다.");
        setIsSaved(false);
      } else {
        // 저장 요청
        // POST는 두 번째 인자가 body, 세 번째가 config임에 주의
        await axios.post(`/api/bookmarks`, null, config);
        alert("대화가 저장되었습니다!");
        setIsSaved(true);
      }
    } catch (error) {
      console.error("저장 기능 오류:", error);
      if (error.response && error.response.status === 403) {
          alert("로그인 세션이 만료되었거나 권한이 없습니다.");
      } else {
          alert("처리에 실패했습니다.");
      }
    }
  };

  return (
    <button
      onClick={toggleSave}
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    >
      {isSaved ? (
        <FaBookmark size={24} color="#FFD700" />
      ) : (
        <FaRegBookmark size={24} color="#Gray" />
      )}
    </button>
  );
};

export default BookmarkButton;