---
name: feedback_icon_text_alignment
description: 아이콘과 텍스트를 같은 행에 쓸 때 iOS에서 텍스트가 아이콘보다 위에 보이는 현상 해결법
metadata:
  type: feedback
---

아이콘과 텍스트를 `flexDirection: 'row'` + `alignItems: 'center'`로 나란히 쓸 때, `lineHeight`를 제거(undefined)해야 iOS에서 시각적으로 수평 정렬된다.

**Why:** iOS에서 `lineHeight === fontSize`이면 텍스트가 박스 상단에 붙어 아이콘보다 위에 떠 보이는 현상이 생긴다. `lineHeight: undefined`로 제거하면 OS가 기본 line-height를 적용해 시각적 중앙이 맞는다.

**How to apply:** 아이콘 옆에 텍스트를 쓰는 컴포넌트(Button, MenuItem, Tag 등)에서는 typo 토큰을 spread한 뒤 반드시 `lineHeight: undefined`를 덮어씌운다.

```js
label: {
  ...typo.labelMedium,
  lineHeight: undefined, // 아이콘과 수평 정렬을 위해 제거
},
```
