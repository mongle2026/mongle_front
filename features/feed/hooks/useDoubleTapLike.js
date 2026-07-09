import { useCallback, useRef } from 'react';

const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_COOLDOWN = 350;

// 게시물 본문 더블탭 → 하트 바운스 + 좋아요 토글 (연속 탭에 의한 상쇄 방지)
export default function useDoubleTapLike({
  onToggleLike,
  onSingleTap,
  doubleTapDelay = DOUBLE_TAP_DELAY,
  cooldown = DOUBLE_TAP_COOLDOWN,
} = {}) {
  const likeRef = useRef(null);
  const lastTapRef = useRef(0);
  const lastToggleRef = useRef(0);
  const tapTimerRef = useRef(null);

  const handleTap = useCallback(() => {
    const now = Date.now();

    // 방금 토글했으면 OS가 중복 전달한 여분 탭 무시 (like+unlike 상쇄 방지)
    if (now - lastToggleRef.current < cooldown) {
      return;
    }

    if (now - lastTapRef.current < doubleTapDelay) {
      clearTimeout(tapTimerRef.current);
      lastTapRef.current = 0;
      lastToggleRef.current = now;
      likeRef.current?.bounce();
      onToggleLike?.();
    } else {
      lastTapRef.current = now;

      if (onSingleTap) {
        tapTimerRef.current = setTimeout(() => {
          onSingleTap();
        }, doubleTapDelay);
      }
    }
  }, [onToggleLike, onSingleTap, doubleTapDelay, cooldown]);

  return { likeRef, handleTap };
}
