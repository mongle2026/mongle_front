module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // React 19에서 Text.defaultProps가 제거됨 → 빌드 시점에 모든 <Text>, <TextInput>에
      // allowFontScaling={false}를 자동 주입해서 핸드폰 텍스트 설정 무관하게 고정
      function injectAllowFontScaling({ types: t }) {
        return {
          visitor: {
            JSXOpeningElement(path) {
              const name = path.node.name;
              if (name.type !== 'JSXIdentifier') return;
              if (name.name !== 'Text' && name.name !== 'TextInput') return;

              const alreadySet = path.node.attributes.some(
                attr =>
                  attr.type === 'JSXAttribute' &&
                  attr.name?.name === 'allowFontScaling',
              );
              if (alreadySet) return;

              path.node.attributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier('allowFontScaling'),
                  t.jsxExpressionContainer(t.booleanLiteral(false)),
                ),
              );
            },
          },
        };
      },
    ],
  };
};
