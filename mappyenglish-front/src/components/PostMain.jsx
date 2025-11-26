// import '../css/PostMain.css';
import Header from './Main/Header';
import BottomBar from './Main/BottomBar';
import BottomSheetMain from './Main/BottomSheetMain';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 라우팅을 위한 hook 임포트
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


const apiKey = process.env.REACT_APP_GMAPS_KEY;
if (!apiKey) {
  throw new Error('REACT_APP_GMAPS_KEY 가 .env에 설정되지 않았습니다.');
}
const GMAPS_LIBRARIES = ['places'];


// ✅ 도시 마커용 SVG 생성 함수 (이전의 얇은 선 + 작은 크기 버전 유지)
const createCitySvgIconUri = () => {
  const bgColor = '#EA4335';
  const iconPath = 'M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z';

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="${bgColor}" stroke="white" stroke-width="2" />
      <g transform="translate(7, 7) scale(0.75)">
        <path fill="white" d="${iconPath}" />
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
};


function PostMain({placeList = []}){

  const navigate = useNavigate(); // ✅ navigate 함수 생성
  const [open, setOpen] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map',
    googleMapsApiKey: apiKey,
    libraries: GMAPS_LIBRARIES,
  });

  const cityList = useMemo(() => {
    const nameUpdates = {
        52: "파리의 에펠탑",
        64: "런던의 빅 벤",
        98: "니스의 해변",
        113: "에든버러의 성"
    };

    if (!placeList || placeList.length === 0) return [];

    return placeList
        .filter(place => Object.keys(nameUpdates).map(Number).includes(place.id))
        .map(place => ({
            ...place,
            name: nameUpdates[place.id]
        }));
  }, [placeList]);


  const getCityMarkerIcon = () => {
      if (!window.google) return null;
      const baseSize = 32;
      return {
          url: createCitySvgIconUri(),
          scaledSize: new window.google.maps.Size(baseSize, baseSize),
          anchor: new window.google.maps.Point(baseSize / 2, baseSize / 2),
          labelOrigin: new window.google.maps.Point(baseSize / 2, baseSize + 8)
      };
  };

  // ✅ 마커 클릭 핸들러: ID에 따라 페이지 이동
  const handleMarkerClick = (id) => {
    // ID별 라우팅 경로 매핑
    const routes = {
        52: '/paris',
        64: '/london',
        98: '/nice',
        113: '/edinburgh'
    };

    const path = routes[id];
    if (path) {
        navigate(path); // 해당 경로로 이동
    }
  };


  if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
  if (!isLoaded) return <div>지도 로딩 중…</div>;

    return(
        <div id='post-main'>
            <div className="vh-screen" style={{minHeight:'100svh', display:'flex', flexDirection:'column'}}>
            <Header/>
            <main style={{ flex: 1, overflowY: 'auto', paddingBottom:
                'calc(64px + max(var(--space-4), env(safe-area-inset-bottom)))' }}>
                <div className="safe-padded" style={{flex:1}}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '60vh' }}
                      center={{ lat: 49.389, lng: 7.584 }}
                      zoom={4.5}
                      options={{
                          clickableIcons: false, // 기본 POI 클릭 방지
                          gestureHandling: 'greedy',
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                      }}
                    >

                    {cityList.map(p => (
                        <Marker
                            key={p.id}
                            position={{lat: p.lat, lng: p.lng}}
                            title={p.name}
                            icon={getCityMarkerIcon()}
                            // ✅ 클릭 이벤트 연결
                            onClick={() => handleMarkerClick(p.id)}
                            label={{
                                text: p.name.split("의")[0],
                                color: "#000",
                                fontWeight: "bold",
                                fontSize: "14px"
                            }}
                        />
                    ))}

                    </GoogleMap>

                    <BottomSheetMain
                        placeList={cityList}
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        title="각 도시의 대표장소"
                        peekHeight='32vh'
                        halfHeight = '50vh'
                        fullHeight = '90vh'
                    >
                    </BottomSheetMain>
                </div>
            </main>
            <BottomBar/>
            </div>
        </div>
    )
}

export default PostMain;