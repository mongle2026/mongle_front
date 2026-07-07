import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { gap, padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

export default function Button({
  label = '버튼',
  icon,
  color = 'brand',
  text,
  onPress,
  disabled = false,
  style,
}) {
  const buttonColor = disabled ? 'disabled' : color;
  const textColor = text ?? color;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, styles[buttonColor], style]}
    >
      {icon ? icon : null}

      <Text style={[styles.text, styles[`${textColor}Text`]]}>
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
    gap: gap.M,
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
  layerWeak: {
    backgroundColor: colors.bgLayerWeak,
  },
  defaultWeak: {
    backgroundColor: colors.bgDefaultWeak,
  },
  layerDefault: {
    backgroundColor: colors.bgLayerDefault,
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
  layerWeakText: {
    color: colors.fgLayerNeutralWeak,
  },
  defaultWeakText: {
    color: colors.fgNeutral,
  },
  criticalStrongText: {
    color: colors.fgCriticalStrong,
  },

});