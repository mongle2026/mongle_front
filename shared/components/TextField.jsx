import { useEffect, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

const PADDING_VERTICAL = padding.M;
const MAX_HEIGHT = 108;

// typo.bodyMedium.lineHeight 22.5 + 위아래 padding 16
const ONE_LINE_HEIGHT = typo.bodyMedium.lineHeight + PADDING_VERTICAL * 2;

export default function TextField({
  value,
  onChangeText,
  onMaxHeightChange,
  placeholder = '이 글에 대한 생각을 작성해 주세요.',
  style,
  ...props
}) {
  const [inputHeight, setInputHeight] = useState(ONE_LINE_HEIGHT);

  useEffect(() => {
    if (!value) {
      setInputHeight(ONE_LINE_HEIGHT);
      onMaxHeightChange?.(false);
    }
  }, [value, onMaxHeightChange]);

  const handleContentSizeChange = (event) => {
    if (!value) {
      setInputHeight(ONE_LINE_HEIGHT);
      onMaxHeightChange?.(false);
      return;
    }

    const contentHeight = event.nativeEvent.contentSize.height;

    const nextHeight = Math.min(
      Math.max(contentHeight, ONE_LINE_HEIGHT),
      MAX_HEIGHT
    );

    setInputHeight(nextHeight);
    onMaxHeightChange?.(nextHeight >= MAX_HEIGHT);
  };

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline
      textAlignVertical="top"
      onContentSizeChange={handleContentSizeChange}
      scrollEnabled={inputHeight >= MAX_HEIGHT}
      style={[
        styles.textField,
        { height: inputHeight },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textField: {
    paddingVertical: PADDING_VERTICAL,
    paddingHorizontal: padding.L,

    borderRadius: radius.M,

    backgroundColor: colors.bgLayerWeak,

    color: colors.fgLayerNeutral,

    ...typo.bodyMedium,
  },
});