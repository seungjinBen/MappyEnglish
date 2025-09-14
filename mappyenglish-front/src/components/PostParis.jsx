import '../css/PostParis.css';
import MyComponent from './Main/Post';
import BottomBar from './Main/BottomBar'; // 파일이름은 무조건 대문자로!


function PostParis(){

    return(
        <div id='post-paris'>
            <div className="vh-screen" style={{minHeight:'100svh', display:'flex', flexDirection:'column'}}>
                {/* 상단 */}
                <header className='mappyHeader'>
                    <div className="safe-padded" style={{paddingTop: 'max(var(--space-4), env(safe-area-inset-top))'}}>
                        <div className="logo" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 0'}}>
                            <img src="/MappyLogo.png"alt="Mappy English Logo"
                                style={{ height: '100px', margin:'-30px 0 -30px 0' }} // 크기는 원하는 대로 조절
                            />
                        </div>
                    </div>
                </header>
                {/* 본문 */}
                <main style={{ flex: 1, overflowY: 'auto', paddingBottom:
                    'calc(64px + max(var(--space-4), env(safe-area-inset-bottom)))' }}>
                    <div className="safe-padded" style={{flex:1}}>
                        <section className='main-container'>
                            <div className='category-bar'>
                                <div className="buttons">
                                    <button className="chip sm place"       onclick="initMap()">모든 장소</button>
                                    <button className="chip sm tour"        onclick="initMapA()">관광명소</button>
                                    <button className="chip sm restaurant"  onclick="initMapB()">음식점</button>
                                    <button className="chip sm store"       onclick="initMapC()">상점</button>
                                    <button className="chip sm traffic"     onclick="initMapD()">대중교통</button>
                                    <button className="chip sm others"      onclick="initMapE()">기타 시설</button>
                                </div>
                            </div>
                            <MyComponent/>
                        </section>
                        <section className='card-container'>
                            <div className="container cq" style={{padding:'var(--space-4) 0'}}>
                                <h2>파리의 대표장소</h2>

                                {/* 컨테이너 쿼리 지원 브라우저: .card-grid / 미지원: .mq-2col */}
                                <div className="card-grid mq-2col">
                                    <article className="card shadow-soft">
                                        <h3 style={{marginTop:0}}>에펠탑</h3>
                                        <picture>
                                            <source srcSet="/img/eiffel-1080.jpg 1080w, /img/eiffel-720.jpg 720w, /img/eiffel-480.jpg 480w" />
                                            <img
                                            src="/img/에펠탑-720.jpg"
                                            loading="lazy"
                                            alt="에펠탑"
                                            style={{width:'100%', height:'auto', borderRadius:'12px', display:'block', marginBottom:'12px'}}
                                            sizes="(max-width: 640px) 100vw, 640px"
                                            />
                                        </picture>
                                        <ul style={{margin:0, paddingLeft:'1em'}}>
                                            <li>Where is the check-in counter?</li>
                                            <li>Could you help me with my baggage?</li>
                                        </ul>
                                    </article>

                                    <article className="card shadow-soft">
                                        <h3 style={{marginTop:0}}>루브르 박물관</h3>
                                        {/* ... */}
                                    </article>
                                    <article className="card shadow-soft">
                                        <h3 style={{marginTop:0}}>공항</h3>
                                        {/* ... */}
                                    </article>
                                    <article className="card shadow-soft">
                                        <h3 style={{marginTop:0}}>공원</h3>
                                        {/* ... */}
                                    </article>
                                    <article className="card shadow-soft">
                                        <h3 style={{marginTop:0}}>호텔</h3>
                                        {/* ... */}
                                    </article>

                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* 하단 네비 (노치/홈바 안전) */}
                <BottomBar/>
            </div>
        </div>
    )
}

export default PostParis;