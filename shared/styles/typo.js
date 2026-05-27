// 사용 예시
// ...typo.bodyMedium

// Android는 fontWeight로 굵기 구분이 안 돼서 fontFamily로 직접 지정
const fontFamily = {
  Regular:  'Pretendard-Regular',
  Medium:   'Pretendard-Medium',
  SemiBold: 'Pretendard-SemiBold',
};

// lineHeight, letterSpacing은 token.json의 % 값을 fontSize 기준으로 계산한 결과
export const typo = {
  titleXSmall:      { fontFamily: fontFamily.Medium,   fontSize: 14, lineHeight: 21,   letterSpacing: -0.14 },
  titleMedium:      { fontFamily: fontFamily.SemiBold, fontSize: 15, lineHeight: 22.5, letterSpacing: 0     },
  labelMedium:      { fontFamily: fontFamily.SemiBold, fontSize: 16, lineHeight: 16,   letterSpacing: 0     },
  bodySmall:        { fontFamily: fontFamily.Regular,  fontSize: 14, lineHeight: 21,   letterSpacing: -0.14 },
  bodyMedium:       { fontFamily: fontFamily.Regular,  fontSize: 15, lineHeight: 22.5, letterSpacing: -0.15 },
  bodyMediumStrong: { fontFamily: fontFamily.SemiBold, fontSize: 15, lineHeight: 22.5, letterSpacing: 0     },
  bodyLarge:        { fontFamily: fontFamily.Regular,  fontSize: 16, lineHeight: 24,   letterSpacing: -0.16 },
  captionSmall:     { fontFamily: fontFamily.Regular,  fontSize: 12, lineHeight: 16.2, letterSpacing: 0     },
};
 