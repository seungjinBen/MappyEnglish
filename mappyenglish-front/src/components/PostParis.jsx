import '../css/PostParis.css';
import BottomBar from './Main/BottomBar'; // 파일이름은 무조건 대문자로!
import BottomSheet from './Main/BottomSheet';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


const apiKey = process.env.REACT_APP_GMAPS_KEY; // ✅ CRA 방식
if (!apiKey) {
  // 런타임 가드(선택)
  throw new Error('REACT_APP_GMAPS_KEY 가 .env에 설정되지 않았습니다.');
}
const GMAPS_LIBRARIES = ['places'];

function PostParis({placeList = []}){

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const handleMarkerClick = (p) => {
    setSelectedPlace(p);
    // 필요하면 state로 정보도 함께 전달
    navigate(`/paris/${p.id}`, {state: {place:p} });
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map',
    googleMapsApiKey: apiKey,
    libraries: GMAPS_LIBRARIES, // libraries: ['places'] 코드는
    // 랜더때마다 ['places']를 새로 만들어 넘기면 스크립트를 다시 로드하려고 해서
    // 경고가 남.
  });

  if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
  if (!isLoaded) return <div>지도 로딩 중…</div>;


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
                        </section>

                        <GoogleMap onClick={()=> {
                            setSelectedPlace(null);
                            navigate('/paris');
                        }}
                          mapContainerStyle={{ width: '100%', height: '60vh' }}
                          center={{ lat: 48.8584, lng: 2.3545 }}
                          zoom={13}
                        >
                        {placeList.map(p => (
                            <Marker key={p.id} position={{lat:p.lat, lng:p.lng}}
                            onClick={() => handleMarkerClick(p)} title={p.name}
                            />
                            ))}
                        </GoogleMap>

                        <BottomSheet
                            open={open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            title="파리의 대표장소"
                            peekHeight='22vh'   // 닫혀 있어도 카드 상단이 넉넉히 보이도록
                            halfHeight = '50vh'
                            fullHeight = '90vh'
                        >
                        </BottomSheet>
                    </div>
                </main>

                {/* 하단 네비 (노치/홈바 안전) */}
                <BottomBar/>
            </div>
        </div>
    )
}

export default PostParis;