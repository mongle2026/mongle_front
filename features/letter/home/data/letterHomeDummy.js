// TODO(API): GET /letter
// 예상 응답 구조 (SAMPLE_GROUPS):
// [{ date: 'YY/MM', letters: [{ id, ... }] }]

// TODO(API): GET /letter/new
// 상단 새 편지 row용 최근 수신 편지 (최대 3개)
// 예상 응답 구조 (NEW_LETTERS):
// [{ id, frontImg, flapImg, stamp }]

import { STAMPS, TEMPLATES, resolvePatternColor } from '../../../write/letter/data/letterCoverData';

export const NEW_LETTERS = TEMPLATES.slice(0, 3).map((t, i) => {
  const resolved = resolvePatternColor(t.patternColorId);
  const color = resolved?.color;
  const stamp = STAMPS.find(s => s.id === t.stampId);
  return { id: i + 1, frontImg: color?.frontImg, flapImg: color?.flapImg, stamp };
});

export const SAMPLE_GROUPS = [
  { date: '25/11', letters: [{ id: 1 }] },
  { date: '25/10', letters: [{ id: 1 }, { id: 2 }] },
  { date: '25/09', letters: [{ id: 1 }, { id: 2 }, { id: 3 }] },
  { date: '25/08', letters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }] },
  { date: '25/05', letters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] },
];
