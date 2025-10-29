import '../../App.css';
import './BottomBar.css'
function BottomBar(){
    return(
        <nav className='mappyBottom' /* ... */>
          <div className="safe-padded" /* ... */>
            <div className="container bottom-nav">
              <a className="btn" href="/">메인지도</a>
              <a className="btn" href="/about">회화 카드</a>
              <a className="btn" href="/profile">내 정보</a>
            </div>
          </div>
        </nav>
    )
}
export default BottomBar;