import { Pressable, Text, StyleSheet, Platform } from 'react-native';

import { colors } from '../styles/color';
import { spacing, padding } from '../styles/token';
import { typo } from '../styles/typo';

export default function ButtonText({
  label = '버튼',
  onPress,
  type = 'brand',
  disabled = false,
  style,
}) {
  const textType = disabled ? 'disabled' : type;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}
    >
      <Text style={[styles.text, styles[textType]]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.M,
    paddingVertical: 12,
    flexShrink: 0,
  },
  text: {
    ...typo.labelMedium,
    textAlign: 'center',
    includeFontPadding: false,
    flexShrink: 0,
  },
  brand: {
    color: colors.fgBrand,
  },
  neutral: {
    color: colors.fgPlaceholder,
  },
  disabled: {
    color: colors.fgDisabled,
  },
});