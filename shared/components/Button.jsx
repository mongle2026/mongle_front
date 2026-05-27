import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

export default function Button({
  label = '버튼',
  color = 'brand',
  onPress,
  disabled = false,
  style,
}) {
  const buttonColor = disabled ? 'disabled' : color;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, styles[buttonColor], style]}
    >
      <Text style={[styles.text, styles[`${buttonColor}Text`]]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 60,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: padding.XL,
    paddingVertical: padding.L,
    borderRadius: radius.M,
  },

  brand: {
    backgroundColor: colors.bgBrandSolid,
  },
  critical: {
    backgroundColor: colors.bgCriticalSolid,
  },
  neutralWeak: {
    backgroundColor: colors.bgNeutralWeak,
  },

  text: {
    ...typo.labelMedium,
    textAlign: 'center',
  },
  brandText: {
    color: colors.fgNeutral,
  },
  criticalText: {
    color: colors.fgNeutral,
  },
  neutralWeakText: {
    color: colors.fgLayerNeutralWeak,
  }
  
});