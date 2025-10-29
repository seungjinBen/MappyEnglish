import React, { useEffect, useMemo, useRef, useState } from 'react';
import './BottomSection.css';
import PlaceCards from './PlaceCards';

function BottomSection({
  conversations,
  selectedPlace,
  placeList = [],
  open,        // 외부에서 열림/닫힘 토글해도 되고,
  onOpen,
  onClose,
  title,
  peekHeight, // 닫힘 상태에서 보이는 높이(px)
  halfHeight, // 반열림에서 보이는 높이
  fullHeight// 거의 전체에서 보이는 높이 (=시트 높이)
}){
    {
      const items = conversations ?? [];
      const showPlacesFallback = !conversations && placeList.length > 0;
      const sheetRef = useRef(null);
      const [peekLocal, setPeekLocal] = useState(peekHeight ?? '32vh');

      // 내부 스냅 상태: 'peek' | 'half' | 'full'
      const [snap, setSnap] = useState('peek');

      // 드래그 상태
      const dragRef = useRef({
        dragging: false,
        startY: 0,
        startVisiblePx: 0,
      });

      // viewport 높이(px)
      const vh = useMemo(() => (typeof window !== 'undefined' ? window.innerHeight : 800), []);

      // 문자열 길이를 px로 변환 ('50vh' | '600px')
      const toPx = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.trim().endsWith('vh')) {
          return (parseFloat(val) / 100) * vh;
        }
        if (typeof val === 'string' && val.trim().endsWith('px')) {
          return parseFloat(val);
        }
        // 단위 없이 숫자 문자열이면 px로 간주
        const n = Number(val);
        return Number.isFinite(n) ? n : 0;
      };

      const peekPx = toPx(peekLocal);
      const halfPx = toPx(halfHeight);
      const fullPx = toPx(fullHeight);

      // 스냅에 따라 CSS 변수 설정
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

      // 외부 open prop이 바뀌면 스냅도 맞춰줌
      useEffect(() => {
        if (peekHeight != null) setPeekLocal(peekHeight);
        }, [peekHeight]);

      // 드래그 시작(헤더/그립에서만 시작)
      const onPointerDown = (e) => {
        // 터치/마우스 모두 지원
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragRef.current.dragging = true;
        dragRef.current.startY = clientY;

        // 현재 visible px 기준
        const currVisible =
          snap === 'peek' ? peekPx
          : snap === 'half' ? halfPx
          : fullPx;
        dragRef.current.startVisiblePx = currVisible;

        // 전역 리스너
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
      };

      const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

      // 드래그 중
      const onPointerMove = (e) => {
        if (!dragRef.current.dragging) return;
        // 스크롤 방지
        if (e.cancelable) e.preventDefault();

        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const dy = dragRef.current.startY - clientY; // 위로 끌면 양수
        let visible = dragRef.current.startVisiblePx + dy;
        visible = clamp(visible, peekPx, fullPx);

        const el = sheetRef.current;
        if (el) {
          el.style.setProperty('--visible-height', `${visible}px`);
        }
      };

      // 드래그 끝 → 가장 가까운 스냅으로
      const onPointerUp = () => {
        dragRef.current.dragging = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);

        // 현재 visible-height 읽어서 스냅 결정
        const el = sheetRef.current;
        if (!el) return;
        const cs = getComputedStyle(el);
        const curr = parseFloat(cs.getPropertyValue('--visible-height')) || peekPx;

        // 스냅 경계(가운데 값 기준)
        const midBetweenPeekHalf = (peekPx + halfPx) / 2;
        const midBetweenHalfFull = (halfPx + fullPx) / 2;

        let next = 'peek';
        if (curr >= midBetweenHalfFull) next = 'full';
        else if (curr >= midBetweenPeekHalf) next = 'half';
        else next = 'peek';

        setSnap(next);

        // 외부 콜백도 호출(선택)
        if (next === 'peek') onClose?.();
        else onOpen?.();
      };

      return (
        <>
          {/* 시트 본체 */}
          <div
            ref={sheetRef}
            className="sheetMain"
            data-open={snap !== 'peek'} /* 써도 되고 안 써도 됨 */
            role="dialog"
            aria-modal
            aria-label={title}
            /* CSS 변수로 스냅 크기 전달 */
            style={{
              '--peek-height': `${peekPx}px`,
              '--full-height': typeof fullHeight === 'number' ? `${fullHeight}px` : fullHeight,
              '--visible-height':
                snap === 'peek' ? `${peekPx}px`
                : snap === 'half' ? (typeof halfHeight === 'number' ? `${halfHeight}px` : halfHeight)
                : (typeof fullHeight === 'number' ? `${fullHeight}px` : fullHeight),
            }}
            /* 닫혀 있을 땐 탭 → 반열림 */
            onClick={snap === 'peek' ? onOpen : undefined}
          >
            {/* 상단 핸들 (중복 요소는 제거) */}
            <div style={{ padding: '0px 16px 0px 16px', pointerEvents: 'auto' }}>
            </div>

            {/* 헤더: 드래그 시작은 여기/그립에서만 */}
            <div
              className="sheetHeader"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={onPointerDown}
              onTouchStart={onPointerDown}
            >
              <div
                className="sheetGrabber"
                title="끌어올리거나 내려서 열기/닫기"
                onPointerDown={onPointerDown}
                onTouchStart={onPointerDown}
              />

              {/* 제목 + 닫기(X)는 항상 표시 */}
              <div className="sheetHeaderRow">
                <div className="sheetTitle">{title}</div>
                <button
                  type="button"
                  className="sheetClose"
                  aria-label="닫기"
                  onClick={(e) => {
                       e.stopPropagation();
                       // ✅ X 클릭 시에만 22vh로 변경
                       setPeekLocal('22vh');
                       setSnap('peek');
                       onClose?.();
                       }}
                >
                  <svg viewBox="0 0 24 24" className="sheetCloseIcon" aria-hidden="true">
                    <path d="M6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* ✅ PlaceCards: 항상 렌더 → 닫힘에서도 일부 보임 */}
            <div className="sheetContent" onClick={(e) => e.stopPropagation()}>
              <PlaceCards
                conversations={conversations}
                selectedPlace={selectedPlace}
              />
            </div>

            {/* 닫힘/반열림에서 살짝 가리는 그라데이션(원하면 유지) */}
            <div className="sheetMask" />
          </div>
        </>
      );
    }
}
export default BottomSection;