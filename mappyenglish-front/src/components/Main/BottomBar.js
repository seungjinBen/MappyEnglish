import React from 'react';
import '../../App.css';
import './BottomBar.css'
import { useAuth } from '../pages/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
function BottomBar(){
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); // 로그인 상태 가져오기

    const isHome = location.pathname === '/';

    // 내 회화노트 클릭 핸들러
    const handleMyCardClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // 1. 원래 이동하려는 동작(Link)을 막음

            // 2. 사용자에게 알림 (선택사항: window.confirm 사용 가능)
            const confirmLogin = window.confirm("로그인이 필요한 서비스입니다.\n로그인 화면으로 이동하시겠습니까?");

            if (confirmLogin) {
                navigate('/login'); // 3. 로그인 페이지로 이동
            }
        }
        // 로그인이 되어있다면 아무것도 안 함 (Link가 정상 작동하여 이동함)
    };
/* <a href="...">는 페이지가 완전히 새로고침되어 방금 로그인한 정보(Context 상태)가 날아갈 수도 있다 */
    return(
        <nav className='mappyBottom' /* ... */>
          <div className="safe-padded" /* ... */>
            <div className="container bottom-nav">
              <Link className="btn" to="/">메인지도</Link>
              <Link className="btn" to="/">{isHome ? '도시 선택' : '퀴즈/상황별 대화'}</Link>
              {/* onClick 이벤트를 추가하여 가로챕니다 */}
              <Link className="btn" to="/my-cards" onClick={handleMyCardClick}>
                  내 회화노트
              </Link>
            </div>
          </div>
        </nav>
    )
}
export default BottomBar;