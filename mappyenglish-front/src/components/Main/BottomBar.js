import '../../App.css';

function BottomBar(){
    return(
        <nav className='mappyBottom' style={{ position:'fixed', left:0, right:0,
            bottom:0, zIndex:50, background:'#fff', borderTop:'1px solid #e2e8f0'}}>
            <div className="safe-padded" style={{
                paddingBottom: 'max(var(--space-4), env(safe-area-inset-bottom))'}}>
                <div className="container" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', padding:'8px 0'}}>
                    <a className="btn" href="/">메인지도</a>
                    <a className="btn" href="/about">회화 카드</a>
                    <a className="btn" href="/profile">내 정보</a>
                </div>
            </div>
        </nav>
    )
}
export default BottomBar;