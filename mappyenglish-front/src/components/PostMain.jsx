// import '../css/PostMain.css';
// import PostList from './Main/PostList';
// import MyComponent from './Main/Post';
import Header from './Main/Header';
import BottomBar from './Main/BottomBar';
import BottomSheetMain from './Main/BottomSheetMain';

import { useState, useMemo } from 'react'; // useMemo 확인
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


const apiKey = process.env.REACT_APP_GMAPS_KEY;
if (!apiKey) {
  throw new Error('REACT_APP_GMAPS_KEY 가 .env에 설정되지 않았습니다.');
}
const GMAPS_LIBRARIES = ['places'];

function PostMain({placeList = []}){ // 기본값 설정 (undefined 방지)

  const [open, setOpen] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map',
    googleMapsApiKey: apiKey,
    libraries: GMAPS_LIBRARIES,
  });

  // ✅ 1. 특정 ID 필터링 및 이름 변경 로직 (cityList 생성)
  const cityList = useMemo(() => {
    // 변경 대상 ID와 새 이름 매핑
    const nameUpdates = {
        52: "파리의 에펠탑",
        64: "런던의 빅 벤",
        98: "니스의 해변",
        113: "에든버러의 성"
    };

    // placeList가 비어있으면 빈 배열 반환
    if (!placeList || placeList.length === 0) return [];

    return placeList
        // 1단계: 해당 ID를 가진 데이터만 걸러냄 (원하는 데이터만 cityList에 담기 위함)
        .filter(place => Object.keys(nameUpdates).map(Number).includes(place.id))
        // 2단계: 이름을 변경하여 새로운 객체로 반환 (불변성 유지)
        .map(place => ({
            ...place,
            name: nameUpdates[place.id]
        }));
  }, [placeList]);


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
                    >
                    {/* 지도에는 전체 placeList를 다 뿌려줄지, cityList만 뿌릴지 선택 필요. 일단 기존대로 placeList 유지 */}
                    {placeList.map(p => (<Marker key={p.id} position={{lat:p.lat, lng:p.lng}} title={p.name}/>))}
                    </GoogleMap>

                    {/* ✅ 2. 가공된 cityList를 BottomSheet에 전달 */}
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