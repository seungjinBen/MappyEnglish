import React, { useEffect, useMemo, useRef, useState } from 'react';
import './BottomSheet.css';
// import PlaceOnlyCards from './PlaceOnlyCards'; // 사용하지 않는다면 주석
import './PlaceCards.css';
import MediaCarousel from './MediaCarousel';
import { Link } from 'react-router-dom'; // Link 사용 권장 (SPA)

function BottomSheetMain({
  placeList,
  open,
  onOpen,
  onClose,
  title,
  peekHeight,
  halfHeight,
  fullHeight
}) {
    const sheetRef = useRef(null);

    // ❌ 삭제: 배열을 객체처럼 분해하면 안 됩니다.
    // const { id, name, category, lat, lng, description, imgUrl } = placeList;

    // 내부 스냅 상태: 'peek' | 'half' | 'full'
    const [snap, setSnap] = useState('peek');
    const dragRef = useRef({ dragging: false, startY: 0, startVisiblePx: 0 });

    // viewport 높이(px)
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

    // CSS 변수 설정 및 스냅 로직 (기존과 동일)
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

    // 드래그 핸들러들 (기존과 동일)
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

    // ✅ 각 도시별 설정값 매핑 (ID 기준)
    const cityConfig = {
        52:  { path: '/paris',     label: '파리 둘러보기' },
        64:  { path: '/london',    label: '런던 둘러보기' },
        98:  { path: '/nice',      label: '니스 둘러보기' },
        113: { path: '/edinburgh', label: '에든버러 둘러보기' }
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
                    <div className="sheetGrabber" />
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

                          {placeList && placeList.length > 0 ? (
                                placeList.map((place) => {
                                  // ✅ 현재 반복중인 장소의 ID로 설정값 가져오기
                                  // 설정이 없으면 기본값(path='/', label='이동하기') 사용
                                  const config = cityConfig[place.id] || { path: '/', label: '지도 보기' };

                                  return (
                                      <article key={place.id} className="card shadow-soft">
                                          <div style={{display:'flex', margin: '0 0 10px 5px', alignItems:'center', justifyContent:'space-between', gap:8}}>
                                              <h3 className="card-title" style={{marginBottom: 0}}>
                                                  {place.name ?? '이름 없음'}
                                              </h3>
                                          </div>

                                          <MediaCarousel
                                              placeId={place.id}
                                              placeName={place.name}
                                              fallbackSrc={place.imgUrl}
                                          />

                                          {place.description && (
                                              <p style={{margin: '0 5px 10px 5px', lineHeight: 1.5, color: '#374151'}}>
                                                  {place.description}
                                              </p>
                                          )}

                                          <div style={{display:'flex', gap:8, marginTop:8}}>
                                              {/* ✅ 동적으로 설정된 링크와 라벨 적용 */}
                                              <Link
                                                  className="btn-outline"
                                                  to={config.path}
                                                  style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }} // 버튼 가운데 정렬 스타일 추가
                                              >
                                                  {config.label}
                                              </Link>
                                          </div>
                                      </article>
                                  );
                                })
                            ) : (
                                <div style={{padding: '20px', textAlign:'center', color:'#999'}}>
                                    로딩 중...
                                </div>
                          )}

                        </div>
                      </div>
                    </section>
                </div>
                <div className="sheetMask" />
            </div>
        </>
    );
}

export default BottomSheetMain;