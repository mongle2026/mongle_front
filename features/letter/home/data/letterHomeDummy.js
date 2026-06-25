// TODO(API): GET /letter
// 예상 응답 구조 (SAMPLE_GROUPS):
// [{ date: 'YY/MM', letters: [{ id, ... }] }]

// TODO(API): GET /letter/new
// 상단 새 편지 row용 최근 수신 편지 (최대 3개)
// 예상 응답 구조 (NEW_LETTERS):
// [{ id, frontImg, flapImg, stamp }]

import { STAMPS, TEMPLATES, resolvePatternColor } from '../../../write/letter/data/letterCoverData';

const IMG_COVER = require('../../../../assets/write/cover_img.png');

const LETTER_DETAILS = [
  {
    senderName: '코코',
    senderImage: null,
    musicTitle: 'Warm on a Cold Night',
    musicArtist: 'HONNE',
    musicCover: IMG_COVER,
    content: '잘 지내? 나는 요즘 그냥 그래. 딱히 바쁜 것도 없고 심심한 것도 없고. 밥은 잘 먹고 있고, 잠도 잘 자고 있어. 주말에 동네 한 바퀴 걸었는데 네가 좋아하던 붕어빵 가게 아직 있더라. 한 봉지 사 먹었어. 맛은 그냥 붕어빵 맛이야. 특별한 거 없어. 근처 편의점도 리모델링 했던데 이제 좌석이 생겼어. 시간 맞으면 같이 가자.',
  },
  {
    senderName: '민준',
    senderImage: null,
    musicTitle: 'Lovefool',
    musicArtist: 'The Cardigans',
    musicCover: IMG_COVER,
    content: '편지 써본 게 진짜 오래됐는데 막상 쓰려니까 뭘 써야 할지 모르겠더라. 그냥 요즘 어떻게 지내는지 궁금하긴 한데 딱히 물어볼 것도 없고. 나는 요즘 퇴근하고 집에서 유튜브 보다 자는 게 루틴이 됐어. 저번 주에 헬스장 등록했는데 아직 한 번도 못 갔어. 이번 주엔 진짜 갈 거야. 아마도.',
  },
  {
    senderName: '서연',
    senderImage: null,
    musicTitle: 'Someone Like You',
    musicArtist: 'Adele',
    musicCover: IMG_COVER,
    content: '안녕. 오랜만이다. 별 내용은 없고 그냥 연락 한번 해보고 싶었어. 나는 요즘 이직 준비 중인데 생각보다 쉽지 않네. 포트폴리오 정리하는 게 제일 귀찮아. 지난주에 스터디카페 새로 등록했고, 주말마다 나가려고 노력 중이야. 밥은 잘 먹고 있어. 요즘 집 근처에 새 식당 생겼는데 거기 돈까스가 꽤 맛있어. 나중에 같이 가도 좋을 것 같아.',
  },
];

export const NEW_LETTERS = TEMPLATES.slice(0, 3).map((t, i) => {
  const resolved = resolvePatternColor(t.patternColorId);
  const color = resolved?.color;
  const stamp = STAMPS.find(s => s.id === t.stampId);
  return { id: i + 1, frontImg: color?.frontImg, flapImg: color?.flapImg, stamp, ...LETTER_DETAILS[i] };
});

export const SAMPLE_GROUPS = [
  { date: '25/11', letters: [{ id: 1, ...LETTER_DETAILS[0] }] },
  { date: '25/10', letters: [{ id: 1, ...LETTER_DETAILS[0] }, { id: 2, ...LETTER_DETAILS[1] }] },
  { date: '25/09', letters: [{ id: 1, ...LETTER_DETAILS[0] }, { id: 2, ...LETTER_DETAILS[1] }, { id: 3, ...LETTER_DETAILS[2] }] },
  { date: '25/08', letters: [{ id: 1, ...LETTER_DETAILS[0] }, { id: 2, ...LETTER_DETAILS[1] }, { id: 3, ...LETTER_DETAILS[2] }, { id: 4, ...LETTER_DETAILS[0] }, { id: 5, ...LETTER_DETAILS[1] }, { id: 6, ...LETTER_DETAILS[2] }] },
  { date: '25/05', letters: [{ id: 1, ...LETTER_DETAILS[0] }, { id: 2, ...LETTER_DETAILS[1] }, { id: 3, ...LETTER_DETAILS[2] }, { id: 4, ...LETTER_DETAILS[0] }] },
];
