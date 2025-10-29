import './PlaceCards.css';

export default function PlaceCards({conversations = [], selectedPlace = [] }) {
    if (!conversations) return null;
    if (!selectedPlace) return null;

    const CATEGORY_LABELS = {
      A: '관광명소',
      B: '음식점',
      C: '상점',
      D: '대중교통',
      E: '기타시설',
    };

    const { id, name, category, lat, lng, description, imgUrl } = selectedPlace;
//    const { type, englishText1, koreanText1, englishText2, koreanText2, englishText3, koreanText3,
//    englishText4, koreanText4, englishText5, koreanText5, englishText6, koreanText6} = Conversations;

    const catLabel = CATEGORY_LABELS[(category ?? '').toUpperCase()] ?? '분류없음';
  return (
    <section className="card-container">
      <div className="container cq">
        {/* 컨테이너 쿼리 지원 브라우저: .card-grid / 미지원: 반응형 미디어쿼리로 대체 */}
        <div className="card-grid mq-2col">
          <article className="card shadow-soft">
            {/* 타이틀 + 카테고리 칩 */}
            <div style={{display:'flex', margin: '0 0 10px 5px',
            alignItems:'center', justifyContent:'space-between', gap:8}}>
              <h3 className="card-title" style={{marginBottom: 0}}>
                {name ?? '이름 없음'}
              </h3>
              {category && <span className="chip-pill">{catLabel}</span>}
            </div>

            {/* 대표 이미지 */}
            <picture>
              <img
                src={imgUrl || '/placeholder.jpg'}
                loading="lazy"
                alt={name || 'place image'}
                className="card-img"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </picture>

            {/* 설명 */}
            {description && (
              <p style={{margin: '0 5px 10px 5px',
              lineHeight: 1.5, color: '#374151'}}>
                {description}
              </p>
            )}

            {/* 메타 정보 */}
            <ul className="meta-list">
                <li>
                  <span className="meta-key">운영 시간</span>
                  <span className="meta-val">
                    넣을까 말까.. 주제에 맞으려나?
                  </span>
                </li>
                <li>
                  <span className="meta-key">근처 명소</span>
                  <span className="meta-val">
                    데이터 어떻게 넣지.. ai?
                  </span>
                </li>
              {id != null && (
                <li>
                  <span className="meta-key">ID</span>
                  <span className="meta-val">#{id}</span>
                </li>
              )}
            </ul>

            {/* 액션 버튼 */}
            {(lat != null && lng != null) && (
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <a
                  className="btn-outline"
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank" rel="noreferrer"
                >
                  구글지도 열기
                </a>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}