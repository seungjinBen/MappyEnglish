import React from 'react'
// import '../../css/Main/Post.css';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';


const apiKey = process.env.REACT_APP_GMAPS_KEY; // ✅ CRA 방식
if (!apiKey) {
  // 런타임 가드(선택)
  throw new Error('REACT_APP_GMAPS_KEY 가 .env에 설정되지 않았습니다.');
}

export default function MyComponent() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map',
    googleMapsApiKey: apiKey,
    libraries: ['places'], // 필요 시
  });

  if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
  if (!isLoaded) return <div>지도 로딩 중…</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '60vh' }}
      center={{ lat: 48.8584, lng: 2.2945 }}
      zoom={13}
    >
      <Marker position={{ lat: 48.8584, lng: 2.2945 }} />
    </GoogleMap>
  );
}
