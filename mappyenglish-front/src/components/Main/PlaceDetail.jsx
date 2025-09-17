import React from 'react'

export default function PlaceDetail({ place }) {
  if (!place) return null;
  const { name, category, address, lat, lng, description, imageUrl } = place;

  return (
    <article className="card shadow-soft" style={{ marginBottom: 12 }}>
      <h3 style={{ marginTop: 0 }}>{name}</h3>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          style={{ width:'100%', height:'auto', borderRadius:12, display:'block', marginBottom:12 }}
          loading="lazy"
        />
      )}

      {address && <p style={{ margin:'4px 0' }}>📍 {address}</p>}
      {category && <p style={{ margin:'4px 0', color:'#6b7280' }}>분류: {category}</p>}
      <p style={{ margin:'4px 0', color:'#6b7280' }}>
        좌표: {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}
      </p>

      {description && <p style={{ marginTop:8 }}>{description}</p>}

      {/* 길찾기 링크(선택) */}
      {lat && lng && (
        <a
          className="btn"
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank" rel="noreferrer"
          style={{ display:'inline-block', marginTop:10, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:10, textDecoration:'none', color:'#111827' }}
        >
          구글 지도에서 보기
        </a>
      )}
    </article>
  );
}