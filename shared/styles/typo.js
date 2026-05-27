// 사용 예시
// ...typo.bodyMedium

const fontWeight = {
  Regular:  '400',
  Medium:   '500',
  SemiBold: '600',
};

const fontFamily = 'Pretendard';

// lineHeight, letterSpacing은 token.json의 % 값을 fontSize 기준으로 계산한 결과
export const typo = {
  titleXSmall:      { fontFamily, fontWeight: fontWeight.Medium,   fontSize: 14, lineHeight: 21,   letterSpacing: -0.14 },
  titleMedium:      { fontFamily, fontWeight: fontWeight.SemiBold, fontSize: 15, lineHeight: 22.5, letterSpacing: 0     },
  labelMedium:      { fontFamily, fontWeight: fontWeight.SemiBold, fontSize: 16, lineHeight: 16,   letterSpacing: 0     },
  bodySmall:        { fontFamily, fontWeight: fontWeight.Regular,  fontSize: 14, lineHeight: 21,   letterSpacing: -0.14 },
  bodyMedium:       { fontFamily, fontWeight: fontWeight.Regular,  fontSize: 15, lineHeight: 22.5, letterSpacing: -0.15 },
  bodyMediumStrong: { fontFamily, fontWeight: fontWeight.SemiBold, fontSize: 15, lineHeight: 22.5, letterSpacing: 0     },
  bodyLarge:        { fontFamily, fontWeight: fontWeight.Regular,  fontSize: 16, lineHeight: 24,   letterSpacing: -0.16 },
  captionSmall:     { fontFamily, fontWeight: fontWeight.Regular,  fontSize: 12, lineHeight: 16.2, letterSpacing: 0     },
};
