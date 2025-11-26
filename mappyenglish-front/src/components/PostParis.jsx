import '../css/PostParis.css';
import Header from './Main/Header';
import BottomBar from './Main/BottomBar';
import BottomSection from './Main/BottomSection';
import BottomSheet from './Main/BottomSheet'; // ✅ BottomSheet import 추가

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


const apiKey = process.env.REACT_APP_GMAPS_KEY;
if (!apiKey) {
  throw new Error('REACT_APP_GMAPS_KEY 가 .env에 설정되지 않았습니다.');
}
const GMAPS_LIBRARIES = ['places'];

const CATEGORIES = [
  { code: 'ALL', label: '모든 장소', className: 'place' },
  { code: 'A',   label: '관광명소', className: 'tour' },
  { code: 'B',   label: '음식점',   className: 'restaurant' },
  { code: 'C',   label: '상점',     className: 'store' },
  { code: 'D',   label: '대중교통', className: 'traffic' },
  { code: 'E',   label: '기타 시설', className: 'others' },
];

// ✅ 1. 카테고리별 스타일 정의 (쇼핑백, 깃발 위치 재수정)
const CATEGORY_STYLES = {
  'A': { // 관광명소 (카메라) - 기존 유지
    color: '#7B1FA2',
    icon: 'M12 8.8c-1.77 0-3.2 1.43-3.2 3.2 0 1.77 1.43 3.2 3.2 3.2 1.77 0 3.2-1.43 3.2-3.2 0-1.77-1.43-3.2-3.2-3.2zm0 4.8c-.88 0-1.6-.72-1.6-1.6 0-.88.72-1.6 1.6-1.6.88 0 1.6.72 1.6 1.6 0 .88-.72 1.6-1.6 1.6zM20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12z',
    translate: 'translate(6, 6)'
  },
  'B': { // 음식점 (포크&숟가락) - 기존 유지
    color: '#FF9800',
    icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 4.25V22h2.5v-8.75c2.09-.41 3.75-2.13 3.75-4.25V9zM17.5 2H21v7c0 2.12-1.66 3.84-3.75 4.25V22h-2.5v-8.75c-2.09-.41-3.75-2.13-3.75-4.25V2zm0 7h2.5V3h-2.5v6z',
    translate: 'translate(6, 6)'
  },
  'C': { // 상점 (쇼핑백)
    color: '#039BE5',
    icon: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 14H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v10z',
    // ✅ 수정: x축을 6 -> 5로 줄여서 왼쪽으로 이동
    translate: 'translate(5, 5)'
  },
  'D': { // 대중교통 (기차) - 기존 유지
    color: '#009688',
    icon: 'M12 2c-4.42 0-8 .5-8 4v10.5c0 .95.38 1.81 1 2.44V22h2v-2h10v2h2v-3.06c.62-.63 1-1.49 1-2.44V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm5.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6h-5V6h5v5z',
    translate: 'translate(6, 6)'
  },
  'E': { // 기타 (깃발)
    color: '#9E9E9E',
    icon: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z',
    // ✅ 수정: x축을 8.5 -> 6.5로 줄여서 왼쪽으로 이동
    translate: 'translate(6.5, 7)'
  },
  'ALL': { // 기본 (핀) - 기존 유지
    color: '#607D8B',
    icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    translate: 'translate(6, 6)'
  }
};

function PostParis({ placeList }){

    const navigate = useNavigate();
    const { id } = useParams(); // /paris 또는 /paris/:id 모두 대응
    const hasId = Boolean(id); // ✅ id가 있으면 true, 없으면 false

    const mapRef = useRef(null);

    const defaultCenter = useMemo(() => ({ lat: 48.8584, lng: 2.3245 }), []);
    const DEFAULT_ZOOM = 12.8;

    const mapOptions = useMemo(
        () => ({
          clickableIcons: false,
          gestureHandling: 'greedy',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
              {
                // 1. 모든 '관심 장소(POI)' 아이콘과 라벨 숨기기
                // (식당, 병원, 학교, 공원 마커 등등이 다 사라짐)
                featureType: "poi",
                stylers: [{ visibility: "off" }],
              },
              {
                // 2. (선택사항) 대중교통(지하철/버스) 아이콘도 숨기고 싶다면 추가
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
              },
              // 3. (선택사항) 지도 색감을 전체적으로 차분하게(회색조) 만들고 싶다면?
              // (유럽 감성 내려면 채도를 살짝 빼는 것도 예쁩니다)
              /*
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ saturation: -20 }]
              }
              */
          ],
        }),
        []
      );

    const [open, setOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [category, setCategory] = useState('ALL');

    // 대화 데이터
    const [conversations, setConversations] = useState([]);
    const [convLoading, setConvLoading] = useState(false);
    const [convError, setConvError] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
      id: 'google-map',
      googleMapsApiKey: apiKey,
      libraries: GMAPS_LIBRARIES,
    });

    const onMapLoad = useCallback((map) => {
      mapRef.current = map;
    }, []);

    const panTo = useCallback((lat, lng, zoom = 15) => {
      if (!mapRef.current) return;
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(zoom);
    }, []);

    // 마커 클릭: 선택 + 중심 이동 + 라우팅
    const handleMarkerClick = useCallback((p) => {
      setSelectedPlace(p);
      panTo(p.lat, p.lng);
      navigate(`/paris/${p.id}`);
      setOpen(true); // 마커 클릭 시 바텀시트 열기
    }, [navigate, panTo]);

    // 지도 빈곳 클릭: 선택 해제 + 라우팅 원복 + 데이터 초기화
    const handleMapClick = useCallback(() => {
      setSelectedPlace(null);
      setConversations([]);
      setConvError(null);
      navigate('/paris');
      // 🔥 [핵심 수정] 초기 좌표와 초기 줌 레벨로 되돌리기
      // panTo 함수를 재활용하여 부드럽게 이동시킵니다.
      panTo(defaultCenter.lat, defaultCenter.lng, DEFAULT_ZOOM);

    }, [navigate, panTo, defaultCenter]);

    // city_id가 숫자 1(파리)이라고 가정
    const parisPlaceList = useMemo(() => {
          return (placeList || []).filter(p => p.cityId === 1);
    }, [placeList]);

    // 현재 카테고리에 맞는 장소만 계산
    const filteredPlaces = useMemo(() => {
      if (category === 'ALL') return parisPlaceList;
      return parisPlaceList.filter((p) => String(p.category) === category);
    }, [parisPlaceList, category]);

    // 카테고리 바뀔 때 선택 장소/URL 정리
    useEffect(() => {
      if (selectedPlace && category !== 'ALL' && String(selectedPlace.category) !== category) {
        setSelectedPlace(null);
        navigate('/paris');
      }
    }, [category, selectedPlace, navigate]);

    // URL 파라미터(id) 변경 시 로직
    useEffect(() => {
      if (!id) return;
      const placeId = Number(id);

      const p = parisPlaceList.find((x) => Number(x.id) === placeId);
      if (p) {
        setSelectedPlace(p);
        panTo(p.lat, p.lng);
        if (p.category && String(p.category) !== category) {
          setCategory(String(p.category));
        }
      }

      const fetchConversations = async () => {
        setConvLoading(true);
        setConvError(null);
        try {
          const { data } = await axios.get(`/api/conversations/place/${placeId}`);
          const list = Array.isArray(data) ? data : (data?.content ?? []);
          setConversations(list);
        } catch (e) {
          setConversations([]);
          setConvError(e?.message || String(e));
        } finally {
          setConvLoading(false);
        }
      };
      fetchConversations();
    }, [id, parisPlaceList, panTo, category]);

    if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
    if (!isLoaded) return <div>지도 로딩 중…</div>;

    const Chip = ({ value, label, className }) => (
      <button
        className={`chip sm ${className ?? ''} ${category === value ? 'active' : ''}`}
        onClick={() => setCategory(value)}
        aria-pressed={category === value}
        type="button"
      >
        {label}
      </button>
    );

    // ✅ 2. SVG 생성 함수 수정 (개별 translate 적용)
    const createSvgIconUri = (category) => {
      const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['ALL'];

      // 캔버스 크기를 조금 늘려 여백 확보 (36x36 -> 38x38)
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
          <circle cx="19" cy="19" r="17" fill="${style.color}" stroke="white" stroke-width="2" />
          <g transform="${style.translate} scale(1.05)">
            <path fill="white" d="${style.icon}" />
          </g>
        </svg>
      `.trim();
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
    };

    // ✅ 3. 마커 크기 축소 설정
    const getMarkerIcon = (place, isSelected) => {
        if (!window.google) return null;

        // ✅ 기본 크기 32x32, 선택 시 42x42로 축소
        const baseSize = 28;
        const scaledSize = isSelected ? 42 : baseSize;

        return {
            url: createSvgIconUri(place.category),

            // 아이콘 크기 및 중심점 설정 (줄어든 크기 반영)
            scaledSize: new window.google.maps.Size(scaledSize, scaledSize),
            anchor: new window.google.maps.Point(scaledSize / 2, scaledSize / 2),

            // 라벨 위치 설정
            labelOrigin: new window.google.maps.Point(scaledSize / 2, scaledSize + 4)
        };
    };

    // id가 52(에펠탑), 64(빅벤) 등 주요 랜드마크인 경우에만 label 표시
    const MAJOR_PLACE_IDS = [14, 19, 23, 35, 52];

    return(
        <div id='post-paris'>
            <div className="vh-screen" style={{minHeight:'100svh', display:'flex', flexDirection:'column'}}>
                <Header/>
                <main style={{ flex: 1, overflowY: 'auto', paddingBottom:
                    'calc(64px + max(var(--space-4), env(safe-area-inset-bottom)))' }}>
                    <div className="safe-padded" style={{flex:1}}>
                        <section className='main-container'>
                            <div className='category-bar'>
                                <div className="buttons">
                                  {CATEGORIES.map((c) => (
                                       <Chip key={c.code} value={c.code} label={c.label} className={c.className} />
                                  ))}
                                </div>
                            </div>
                        </section>

                        <GoogleMap
                            onLoad={onMapLoad}
                            onClick={handleMapClick}
                            options={mapOptions}
                            mapContainerStyle={{ width: '100%', height: '60vh' }}
                            {...(!hasId ? { center: defaultCenter } : { defaultCenter })}
                            zoom={12.8}
                        >
                        {filteredPlaces.map(p => {
                            // 현재 마커가 선택된 상태인지 확인
                            const isSelected = selectedPlace && selectedPlace.id === p.id;
                            const showLabel = isSelected || MAJOR_PLACE_IDS.includes(p.id);

                            return (
                                <Marker
                                    key={p.id}
                                    position={{lat: p.lat, lng: p.lng}}
                                    onClick={() => handleMarkerClick(p)}
                                    title={p.name}

                                    // ✅ 아이콘 스타일 적용
                                    icon={getMarkerIcon(p, isSelected)}

                                    // ✅ (선택사항) 선택된 마커는 맨 위로 올리기
                                    zIndex={isSelected ? 999 : (showLabel ? 100 : 1)}
                                    // ✅ (선택사항) 주요 랜드마크 텍스트 라벨 (필요 없으면 삭제 가능)
                                    // 라벨도 선택된 애한테만 보여주면 깔끔함
                                    label={showLabel ? {
                                        text: p.name,
                                        color: "#222222",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        className: "marker-label-style" // css 필요 시
                                    } : null}
                                />
                            );
                        })}
                        </GoogleMap>

                        {/* ✅ 조건부 렌더링 적용 */}
                        {hasId ? (
                            // 1. 마커 클릭 시 (URL에 id 있음) -> 상세 회화화면(BottomSection)
                            <BottomSection
                                conversations={conversations}
                                selectedPlace={selectedPlace}
                                open={open}
                                onOpen={() => setOpen(true)}
                                onClose={() => setOpen(false)}
                                title="실전 회화연습"
                                peekHeight='32vh'
                                halfHeight = '50vh'
                                fullHeight = '90vh'
                            />
                        ) : (
                            // 2. 마커 미클릭 시 (URL에 id 없음) -> 파리 전체 장소 리스트(BottomSheet)
                            <BottomSheet
                                placeList={filteredPlaces} // 현재 필터링된 파리 장소들 전달
                                open={open}
                                onOpen={() => setOpen(true)}
                                onClose={() => setOpen(false)}
                                title="파리의 대표장소"
                                peekHeight='32vh'
                                halfHeight = '50vh'
                                fullHeight = '90vh'
                            />
                        )}

                    </div>
                </main>
                <BottomBar/>
            </div>
        </div>
    )
}

PostParis.defaultProps = {
  placeList: []
};

export default PostParis;