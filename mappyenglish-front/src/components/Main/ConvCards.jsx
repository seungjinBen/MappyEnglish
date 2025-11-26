// =============================
// File: ConvCards.jsx
// =============================
import React, { useRef } from "react";
import "./ConvCards.css";
import BookmarkButton from "./BookmarkButton";

/**
 * conversations: Array<{
 *   id: number,
 *   type: 'A'|'B', // A = 내가 먼저, B = 상대가 먼저
 *   place?: { name?: string, ... },
 *   lines: Array<{ lineOrder:number, englishText:string, koreanText:string, audioUrl?:string }>
 * }>
 */
export function ConvCards({ conversations = [], meLabel = 'Me', otherLabel = 'Partner' }) {
  return (
    <div className="convcards">
      {conversations.length === 0 && <div className="empty">No conversations available.</div>}
      {conversations.map((conv, idx) => (
        <ConvCard key={conv?.id ?? idx} conv={conv} meLabel={meLabel} otherLabel={otherLabel} index={idx + 1} />
      ))}
    </div>
  );
}

function ConvCard({ conv, meLabel, otherLabel, index }) {
  const startSide = String(conv?.type || 'A').toUpperCase() === 'A' ? 'me' : 'other';
  const altSide = startSide === 'me' ? 'other' : 'me';

  // lineOrder 기준 정렬 (없으면 입력 순서 유지)
  const lines = Array.isArray(conv?.lines) ? [...conv.lines] : [];
  lines.sort((a, b) => {
    const ao = typeof a?.lineOrder === 'number' ? a.lineOrder : Number.MAX_SAFE_INTEGER;
    const bo = typeof b?.lineOrder === 'number' ? b.lineOrder : Number.MAX_SAFE_INTEGER;
    return ao - bo;
  });

  const msgs = lines.map((l, i) => {
    const order = typeof l.lineOrder === 'number' ? l.lineOrder : i + 1;
    const side = order % 2 === 1 ? startSide : altSide; // 홀수=시작자, 짝수=상대
    return { order, side, en: l?.englishText || '', ko: l?.koreanText || '', audio: l?.audioUrl || '' };
  });

  return (
    <section className="card" aria-label={`Conversation ${index}`}>
      <header className="card__header">
        <span className="card__index">
          #{index}{conv?.place?.name ? ' · ' + conv.place.name : ''}
        </span>
//        <span className={`badge ${startSide === 'me' ? 'badge--me' : 'badge--other'}`}>
//          {startSide === 'me' ? 'Type A · 회화 저장' : 'Type B · 회화 저장'}
//        </span>
        <BookmarkButton className="badge"
          userId={5} // 로그인된 유저 ID
          conversationId={conv.id} // 현재 카드의 대화 ID
          initialIsSaved={false} // (선택) 처음 로딩 시 저장 여부를 안다면 전달
       />
      </header>

      <div className="chat">
        {msgs.map((m) => (
          <Bubble key={m.order} side={m.side} en={m.en} ko={m.ko} audio={m.audio} meLabel={meLabel} otherLabel={otherLabel} />
        ))}
      </div>
    </section>
  );
}

function Bubble({ side, en, ko, audio, meLabel, otherLabel }) {
  const isMe = side === 'me';
  const audioRef = useRef(null);

  const playAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.currentTime = 0;
      el.play();
    } catch {}
  };

  return (
    <div className={`row ${isMe ? 'row--me' : 'row--other'}`}>
      {!isMe && <div className="avatar" aria-hidden="true">{initials(otherLabel)}</div>}

      <div className={`bubble ${isMe ? 'bubble--me' : 'bubble--other'}`} role="group" aria-label={isMe ? meLabel : otherLabel}>
        <div className="bubble-header">
          {en && <p className="en" lang="en">{en}</p>}
          {audio && (
            <button type="button" className="audio-btn" onClick={playAudio} aria-label="Play audio">
              ▶
            </button>
          )}
        </div>
        {ko && <p className="ko" lang="ko">{ko}</p>}
        {audio && <audio ref={audioRef} src={audio} preload="none" />}
      </div>

      {isMe && <div className="avatar avatar--me" aria-hidden="true">{initials(meLabel)}</div>}
    </div>
  );
}

function initials(name = '') {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 0) return '?';
  const [a, b] = parts;
  return (a?.[0] || '') + (b?.[0] || '');
}

export default ConvCards;
