import { Pressable, Text, StyleSheet } from 'react-native';

export default function ButtonText({
  label = '버튼',
  onPress,
  type = 'brand',
  disabled = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}
    >
      <Text
        style={[
          styles.text,
          styles[type],
          disabled && styles.disabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'left',
  },
  brand: {
    color: '#4596FF',
  },
  gray: {
    color: '#7A8087',
  },
  black: {
    color: '#1A1B1C',
  },
  disabled: {
    color: '#B8BDC3',
  },
});