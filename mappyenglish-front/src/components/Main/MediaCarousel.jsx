import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./MediaCarousel.css";

export default function MediaCarousel({ placeId, placeName = "place media", fallbackSrc }) {
  const [items, setItems] = useState([]);      // [{type:'image'|'video', src}]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [idx, setIdx] = useState(0);

  const viewportRef = useRef(null);
  const startXRef = useRef(null);

  // 🔹 뷰포트 실제 너비(px) 측정 (패딩/보더와 무관)
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setVw(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  // 🔹 데이터 로드
  useEffect(() => {
    if (placeId == null) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setIdx(0);
        const { data } = await axios.get(`/api/media/${placeId}`);
        const imgs = (data?.images ?? []).map((src) => ({ type: "image", src }));
        const vids = (data?.videos ?? []).map((src) => ({ type: "video", src }));
        const arr = [...imgs, ...vids];
        if (!alive) return;
        setItems(
          arr.length ? arr : [{ type: "image", src: fallbackSrc || "/placeholder.jpg" }]
        );
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "load error");
        setItems([{ type: "image", src: fallbackSrc || "/placeholder.jpg" }]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [placeId, fallbackSrc]);

  const count = items.length;
  const clamp = (n) => (count === 0 ? 0 : (n + count) % count);
  const prev = () => setIdx((v) => clamp(v - 1));
  const next = () => setIdx((v) => clamp(v + 1));

  // 🔹 드래그/스와이프
  const onPointerDown = (e) => { startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0; };
  const onPointerUp = (e) => {
    if (startXRef.current == null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const dx = endX - startXRef.current;
    startXRef.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
  };

  // 🔹 키보드 ← →
  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, []);

  // 🔹 트랙을 px로 정확히 이동
  const trackStyle = useMemo(() => ({
    width: `${items.length * vw}px`,
    transform: `translateX(-${idx * vw}px)`,
    transition: "transform 280ms ease",
  }), [items.length, idx, vw]);

  return (
    <div
      className="media-carousel"
      ref={wrapRef}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchEnd={onPointerUp}
      aria-label="place media carousel"
    >
      {loading && <div className="media-status">불러오는 중…</div>}
      {!loading && err && <div className="media-status warn">로드 실패: {err}</div>}

      <div className="media-viewport" ref={viewportRef}>
        <div className="media-track" style={trackStyle}>
          {items.map((m, i) => (
            <div className="media-slide" key={i} style={{ width: `${vw}px` }}>
              {m.type === "image" ? (
                <img
                  className="media-img"
                  src={m.src}
                  alt={`${placeName} - 이미지 ${i + 1}`}
                  loading="lazy"
                />
              ) : (
                <video
                  className="media-video"
                  src={m.src}
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button className="nav-btn left" onClick={prev} aria-label="이전">‹</button>
          <button className="nav-btn right" onClick={next} aria-label="다음">›</button>

          <div className="dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === idx ? "active" : ""}`}
                aria-label={`${i + 1}번으로 이동`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>

          <div className="counter" aria-hidden>
            {idx + 1} / {count}
          </div>
        </>
      )}
    </div>
  );
}