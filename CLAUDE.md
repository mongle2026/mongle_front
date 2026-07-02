@AGENTS.md

## 아이콘 + 텍스트 수평 정렬

아이콘 옆에 텍스트를 쓰는 컴포넌트(Button, MenuItem, Tag 등)에서는 typo 토큰 spread 후 반드시 `lineHeight: undefined`를 덮어씌운다.

```js
label: {
  ...typo.labelMedium,
  lineHeight: undefined, // iOS에서 아이콘과 수평 정렬을 위해 제거
},
```

iOS에서 `lineHeight === fontSize`이면 텍스트가 박스 상단에 붙어 아이콘보다 위에 떠 보이는 현상이 생긴다.
