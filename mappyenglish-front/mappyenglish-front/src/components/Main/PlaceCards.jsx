import './PlaceCards.css';

export default function PlaceCards() {
  return (
    <section className="card-container">
      <div className="container cq">
        {/* 컨테이너 쿼리 지원 브라우저: .card-grid / 미지원: 반응형 미디어쿼리로 대체 */}
        <div className="card-grid mq-2col">
          <article className="card shadow-soft">
            <h3 className="card-title">에펠탑</h3>
            <picture>
              <source
                srcSet="/img/eiffel-1080.jpg 1080w, /img/eiffel-720.jpg 720w, /img/eiffel-480.jpg 480w"
                type="image/jpeg"
              />
              <img
                src="/img/에펠탑-720.jpg"
                loading="lazy"
                alt="에펠탑"
                className="card-img"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </picture>
            <ul className="card-list">
              <li>Where is the check-in counter?</li>
              <li>Could you help me with my baggage?</li>
            </ul>
          </article>

          <article className="card shadow-soft">
            <h3 className="card-title">루브르 박물관</h3>
            {/* 필요한 이미지/문구로 채우기 */}
          </article>

          <article className="card shadow-soft">
            <h3 className="card-title">공항</h3>
          </article>

          <article className="card shadow-soft">
            <h3 className="card-title">공원</h3>
                <ul className="card-list">
                  <li>Where is the check-in counter?</li>
                  <li>Could you help me with my baggage?</li>
                </ul>
          </article>

          <article className="card shadow-soft">
            <h3 className="card-title">호텔</h3>
                <ul className="card-list">
                  <li>Where is the check-in counter?</li>
                  <li>Could you help me with my baggage?</li>
                </ul>
          </article>
          <article className="card shadow-soft">
            <h3 className="card-title">식당</h3>
                <ul className="card-list">
                  <li>Where is the check-in counter?</li>
                  <li>Could you help me with my baggage?</li>
                </ul>
          </article>
          <article className="card shadow-soft">
            <h3 className="card-title">화장실</h3>
                <ul className="card-list">
                  <li>Where is the check-in counter?</li>
                  <li>Could you help me with my baggage?</li>
                </ul>
          </article>

        </div>
      </div>
    </section>
  );
}