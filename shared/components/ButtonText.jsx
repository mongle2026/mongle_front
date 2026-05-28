import { Pressable, Text, StyleSheet } from 'react-native';

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
      <Text style={[styles.text, styles[textType]]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 40,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.M,
    paddingVertical: padding.L,
  },
  text: {
    ...typo.labelMedium,
    textAlign: 'center',
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