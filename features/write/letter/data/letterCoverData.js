// 패턴 이미지 경로 헬퍼
const p = (pattern, color, face) =>
  require(`../../../../assets/letter_cover/patterns/p${pattern}_c${color}_${face}.svg`);

// 패턴 목록
// colors 배열의 첫 번째 항목 = 해당 패턴의 기본 컬러
export const PATTERNS = [
  {
    id: 'p1',
    thumbnail: p(1, 1, 'front'),
    colors: [
      { id: 'p1_c1', frontImg: p(1,1,'front'), flapImg: p(1,1,'flap'), sideImg: p(1,1,'side'), backImg: p(1,1,'back') },
      { id: 'p1_c2', frontImg: p(1,2,'front'), flapImg: p(1,2,'flap'), sideImg: p(1,2,'side'), backImg: p(1,2,'back') },
      { id: 'p1_c3', frontImg: p(1,3,'front'), flapImg: p(1,3,'flap'), sideImg: p(1,3,'side'), backImg: p(1,3,'back') },
      { id: 'p1_c4', frontImg: p(1,4,'front'), flapImg: p(1,4,'flap'), sideImg: p(1,4,'side'), backImg: p(1,4,'back') },
      { id: 'p1_c5', frontImg: p(1,5,'front'), flapImg: p(1,5,'flap'), sideImg: p(1,5,'side'), backImg: p(1,5,'back') },
      { id: 'p1_c6', frontImg: p(1,6,'front'), flapImg: p(1,6,'flap'), sideImg: p(1,6,'side'), backImg: p(1,6,'back') },
    ],
  },
  {
    id: 'p2',
    thumbnail: p(2, 1, 'front'),
    colors: [
      { id: 'p2_c1', frontImg: p(2,1,'front'), flapImg: p(2,1,'flap'), sideImg: p(2,1,'side') },
      { id: 'p2_c2', frontImg: p(2,2,'front'), flapImg: p(2,2,'flap'), sideImg: p(2,2,'side') },
      { id: 'p2_c3', frontImg: p(2,3,'front'), flapImg: p(2,3,'flap'), sideImg: p(2,3,'side') },
      { id: 'p2_c4', frontImg: p(2,4,'front'), flapImg: p(2,4,'flap'), sideImg: p(2,4,'side') },
      { id: 'p2_c5', frontImg: p(2,5,'front'), flapImg: p(2,5,'flap'), sideImg: p(2,5,'side') },
      { id: 'p2_c6', frontImg: p(2,6,'front'), flapImg: p(2,6,'flap'), sideImg: p(2,6,'side') },
    ],
  },
  {
    id: 'p3',
    thumbnail: p(3, 1, 'front'),
    colors: [
      { id: 'p3_c1', frontImg: p(3,1,'front'), flapImg: p(3,1,'flap'), sideImg: p(3,1,'side') },
      { id: 'p3_c2', frontImg: p(3,2,'front'), flapImg: p(3,2,'flap'), sideImg: p(3,2,'side') },
      { id: 'p3_c3', frontImg: p(3,3,'front'), flapImg: p(3,3,'flap'), sideImg: p(3,3,'side') },
      { id: 'p3_c4', frontImg: p(3,4,'front'), flapImg: p(3,4,'flap'), sideImg: p(3,4,'side') },
    ],
  },
  {
    id: 'p4',
    thumbnail: p(4, 1, 'front'),
    colors: [
      { id: 'p4_c1', frontImg: p(4,1,'front'), flapImg: p(4,1,'flap'), sideImg: p(4,1,'side') },
      { id: 'p4_c2', frontImg: p(4,2,'front'), flapImg: p(4,2,'flap'), sideImg: p(4,2,'side') },
      { id: 'p4_c3', frontImg: p(4,3,'front'), flapImg: p(4,3,'flap'), sideImg: p(4,3,'side') },
      { id: 'p4_c4', frontImg: p(4,4,'front'), flapImg: p(4,4,'flap'), sideImg: p(4,4,'side') },
      { id: 'p4_c5', frontImg: p(4,5,'front'), flapImg: p(4,5,'flap'), sideImg: p(4,5,'side') },
    ],
  },
  {
    id: 'p5',
    thumbnail: p(5, 1, 'front'),
    colors: [
      { id: 'p5_c1', frontImg: p(5,1,'front'), flapImg: p(5,1,'flap'), sideImg: p(5,1,'side') },
      { id: 'p5_c2', frontImg: p(5,2,'front'), flapImg: p(5,2,'flap'), sideImg: p(5,2,'side') },
      { id: 'p5_c3', frontImg: p(5,3,'front'), flapImg: p(5,3,'flap'), sideImg: p(5,3,'side') },
      { id: 'p5_c4', frontImg: p(5,4,'front'), flapImg: p(5,4,'flap'), sideImg: p(5,4,'side') },
      { id: 'p5_c5', frontImg: p(5,5,'front'), flapImg: p(5,5,'flap'), sideImg: p(5,5,'side') },
      { id: 'p5_c6', frontImg: p(5,6,'front'), flapImg: p(5,6,'flap'), sideImg: p(5,6,'side') },
    ],
  },
  {
    id: 'p6',
    thumbnail: p(6, 1, 'front'),
    colors: [
      { id: 'p6_c1', frontImg: p(6,1,'front'), flapImg: p(6,1,'flap'), sideImg: p(6,1,'side') },
      { id: 'p6_c2', frontImg: p(6,2,'front'), flapImg: p(6,2,'flap'), sideImg: p(6,2,'side') },
      { id: 'p6_c3', frontImg: p(6,3,'front'), flapImg: p(6,3,'flap'), sideImg: p(6,3,'side') },
      { id: 'p6_c4', frontImg: p(6,4,'front'), flapImg: p(6,4,'flap'), sideImg: p(6,4,'side') },
      { id: 'p6_c5', frontImg: p(6,5,'front'), flapImg: p(6,5,'flap'), sideImg: p(6,5,'side') },
    ],
  },
  {
    id: 'p7',
    thumbnail: p(7, 1, 'front'),
    colors: [
      { id: 'p7_c1', frontImg: p(7,1,'front'), flapImg: p(7,1,'flap'), sideImg: p(7,1,'side') },
      { id: 'p7_c2', frontImg: p(7,2,'front'), flapImg: p(7,2,'flap'), sideImg: p(7,2,'side') },
      { id: 'p7_c3', frontImg: p(7,3,'front'), flapImg: p(7,3,'flap'), sideImg: p(7,3,'side') },
      { id: 'p7_c4', frontImg: p(7,4,'front'), flapImg: p(7,4,'flap'), sideImg: p(7,4,'side') },
      { id: 'p7_c5', frontImg: p(7,5,'front'), flapImg: p(7,5,'flap'), sideImg: p(7,5,'side') },
      { id: 'p7_c6', frontImg: p(7,6,'front'), flapImg: p(7,6,'flap'), sideImg: p(7,6,'side') },
    ],
  },
];

// 우표 목록 — 첫 번째 항목 = 기본 우표
// TODO: 실제 우표 이미지로 교체
const STAMP_PLACEHOLDER = require('../../../../assets/write/cover_img.png');
export const STAMPS = [
  { id: 's1', image: STAMP_PLACEHOLDER },
  { id: 's2', image: STAMP_PLACEHOLDER },
  { id: 's3', image: STAMP_PLACEHOLDER },
  { id: 's4', image: STAMP_PLACEHOLDER },
  { id: 's5', image: STAMP_PLACEHOLDER },
  { id: 's6', image: STAMP_PLACEHOLDER },
  { id: 's7', image: STAMP_PLACEHOLDER },
  { id: 's8', image: STAMP_PLACEHOLDER },
  { id: 's9', image: STAMP_PLACEHOLDER },
];

// 템플릿 목록 — 기본 패턴/컬러/우표 조합의 프리셋
// TODO: 실제 미리보기 이미지로 교체
const TEMPLATE_PLACEHOLDER = require('../../../../assets/write/cover_img.png');
export const TEMPLATES = [
  { id: 't1', label: '추천 템플릿1', preview: TEMPLATE_PLACEHOLDER, patternColorId: 'p1_c1', stampId: 's1' },
  { id: 't2', label: '추천 템플릿2', preview: TEMPLATE_PLACEHOLDER, patternColorId: 'p2_c1', stampId: 's2' },
  { id: 't3', label: '추천 템플릿3', preview: TEMPLATE_PLACEHOLDER, patternColorId: 'p3_c1', stampId: 's3' },
  { id: 't4', label: '추천 템플릿4', preview: TEMPLATE_PLACEHOLDER, patternColorId: 'p4_c1', stampId: 's4' },
  { id: 't5', label: '추천 템플릿5', preview: TEMPLATE_PLACEHOLDER, patternColorId: 'p5_c1', stampId: 's5' },
  { id: 't6', label: '추천 템플릿6', preview: TEMPLATE_PLACEHOLDER, patternColorId: 'p6_c1', stampId: 's6' },
];

// 유틸 — patternColorId로 { pattern, color } 객체 반환
export function resolvePatternColor(patternColorId) {
  for (const pattern of PATTERNS) {
    const color = pattern.colors.find(c => c.id === patternColorId);
    if (color) return { pattern, color };
  }
  return null;
}
