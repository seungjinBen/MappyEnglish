import React, { useEffect, useMemo, useRef, useState } from 'react';
import './BottomSheet.css';
import './PlaceCards.css';
import './MediaCarousel.css';
import { Link } from 'react-router-dom'; // ✅ Link 임포트 필수

function BottomSheet({
  placeList,
  open,
  onOpen,
  onClose,
  title,
  peekHeight,
  halfHeight,
  fullHeight
}) {
    // ❌ 삭제: 배열을 구조분해 할당하면 오류가 납니다.
    // const { id, name, category, lat, lng, description, imgUrl } = placeList;

    const sheetRef = useRef(null);
    const [snap, setSnap] = useState('peek');

    // ... (드래그, 스냅 로직은 기존과 100% 동일하여 생략, 아래 return 부분만 수정하시면 됩니다) ...
    // 기존의 useRef, useMemo, toPx, useEffect, 핸들러 함수들은 그대로 두세요.

    const dragRef = useRef({ dragging: false, startY: 0, startVisiblePx: 0 });
    const vh = useMemo(() => (typeof window !== 'undefined' ? window.innerHeight : 800), []);
    const toPx = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.trim().endsWith('vh')) {
            return (parseFloat(val) / 100) * vh;
        }
        if (typeof val === 'string' && val.trim().endsWith('px')) {
            return parseFloat(val);
        }
        const n = Number(val);
        return Number.isFinite(n) ? n : 0;
    };
    const peekPx = toPx(peekHeight);
    const halfPx = toPx(halfHeight);
    const fullPx = toPx(fullHeight);

    useEffect(() => {
        const el = sheetRef.current;
        if (!el) return;
        el.style.setProperty('--full-height', typeof fullHeight === 'number' ? `${fullHeight}px` : fullHeight);
        const visible =
            snap === 'peek' ? `${peekPx}px`
            : snap === 'half' ? (typeof halfHeight === 'number' ? `${halfHeight}px` : halfHeight)
            : (typeof fullHeight === 'number' ? `${fullHeight}px` : fullHeight);
        el.style.setProperty('--visible-height', visible);
    }, [snap, peekPx, halfHeight, fullHeight]);

    useEffect(() => {
        if (open == null) return;
        setSnap(open ? 'half' : 'peek');
    }, [open]);

    const onPointerDown = (e) => {
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragRef.current.dragging = true;
        dragRef.current.startY = clientY;
        const currVisible = snap === 'peek' ? peekPx : snap === 'half' ? halfPx : fullPx;
        dragRef.current.startVisiblePx = currVisible;
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
    };

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    const onPointerMove = (e) => {
        if (!dragRef.current.dragging) return;
        if (e.cancelable) e.preventDefault();
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const dy = dragRef.current.startY - clientY;
        let visible = dragRef.current.startVisiblePx + dy;
        visible = clamp(visible, peekPx, fullPx);
        const el = sheetRef.current;
        if (el) el.style.setProperty('--visible-height', `${visible}px`);
    };

    const onPointerUp = () => {
        dragRef.current.dragging = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
        const el = sheetRef.current;
        if (!el) return;
        const cs = getComputedStyle(el);
        const curr = parseFloat(cs.getPropertyValue('--visible-height')) || peekPx;
        const midBetweenPeekHalf = (peekPx + halfPx) / 2;
        const midBetweenHalfFull = (halfPx + fullPx) / 2;
        let next = 'peek';
        if (curr >= midBetweenHalfFull) next = 'full';
        else if (curr >= midBetweenPeekHalf) next = 'half';
        else next = 'peek';
        setSnap(next);
        if (next === 'peek') onClose?.();
        else onOpen?.();
    };

    return (
        <>
            <div
                ref={sheetRef}
                className="sheetMain"
                data-open={snap !== 'peek'}
                role="dialog"
                aria-modal
                aria-label={title}
                style={{
                    '--peek-height': `${peekPx}px`,
                    '--full-height': typeof fullHeight === 'number' ? `${fullHeight}px` : fullHeight,
                    '--visible-height':
                        snap === 'peek' ? `${peekPx}px`
                        : snap === 'half' ? (typeof halfHeight === 'number' ? `${halfHeight}px` : halfHeight)
                        : (typeof fullHeight === 'number' ? `${fullHeight}px` : fullHeight),
                }}
                onClick={snap === 'peek' ? onOpen : undefined}
            >
                <div style={{ padding: '0px 16px 0px 16px', pointerEvents: 'auto' }}></div>

                <div
                    className="sheetHeader"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={onPointerDown}
                    onTouchStart={onPointerDown}
                >
                    <div className="sheetGrabber" title="끌어올리거나 내려서 열기/닫기" />
                    <div className="sheetHeaderRow">
                        <div className="sheetTitle">{title}</div>
                        <button type="button" className="sheetClose" onClick={(e) => { e.stopPropagation(); setSnap('peek'); onClose?.(); }}>
                            <svg viewBox="0 0 24 24" className="sheetCloseIcon"><path d="M6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5z" /></svg>
                        </button>
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px', lineHeight: '1.4', paddingBottom: '8px' }}>
                        마커를 클릭해 <strong>현지 상황에 딱 맞는 회화</strong>를 배워보세요!
                    </div>
                </div>

                <div className="sheetContent" onClick={(e) => e.stopPropagation()}>
                    <section className="card-container">
                          <div className="container cq">
                            <div className="card-grid mq-2col">

                              {/* ✅ 리스트 반복 렌더링 시작 */}
                              {placeList && placeList.map(place => (
                                  <article key={place.id} className="card shadow-soft">
                                    <div style={{display:'flex', margin: '0 0 10px 5px', alignItems:'center', justifyContent:'space-between', gap:8}}>
                                      <h3 className="card-title" style={{marginBottom: 0}}>
                                        {place.name ?? '이름 없음'}
                                      </h3>
                                    </div>

                                    <div className="media-carousel">
                                      <div className="media-viewport">
                                        {/* 트랙(track) 없이 바로 슬라이드 하나만 배치 */}
                                        <div className="media-slide">
                                          <img
                                            className="media-img"
                                            src={place.imgUrl || '/placeholder.jpg'}
                                            alt={place.name}
                                            loading="lazy"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {place.description && (
                                      <p style={{
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        color: '#333333',             // 또렷한 회색
                                        margin: '6px',
                                        wordBreak: 'keep-all',
                                        letterSpacing: '-0.3px'
                                      }}>
                                        {place.description}
                                      </p>
                                    )}

                                    {/* ✅ 라우팅 버튼 수정됨 */}
                                    <div style={{display:'flex', gap:8, marginTop:8}}>
                                        <Link
                                          className="btn-outline"
                                          to={`/paris/${place.id}`} // 파리 + 장소ID 조합
                                          style={{ width: '100%', textAlign: 'center', justifyContent: 'center'}}
                                        >
                                          실전 회화 연습하기
                                        </Link>
                                    </div>
                                  </article>
                              ))}

                            </div>
                          </div>
                    </section>
                </div>
                <div className="sheetMask" />
            </div>
        </>
    );
}

export default BottomSheet;