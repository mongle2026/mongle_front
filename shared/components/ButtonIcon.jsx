import { Pressable, StyleSheet } from 'react-native';

import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';

const BUTTON_SIZE = {
  XS: 16,
  S: 28,
  M: 40,
  L: 40,
  XL: 40,
};

const ICON_SIZE = {
  XS: 8,
  S: 12,
  M: 16,
  L: 20,
  XL: 32,
};

export default function ButtonIcon({
  Icon,
  size = 'S',
  variant = 'overlay',
  onPress,
  disabled = false,
  iconColor,
  style,
}) {
  const isXs = size === 'XS';
  const resolvedIconColor =
    iconColor ?? (isXs ? colors.fgLayerNeutral : colors.fgNeutral);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isXs ? styles.xs : styles[variant],
        {
          width: BUTTON_SIZE[size],
          height: BUTTON_SIZE[size],
          ...(size === 'S' && { padding: padding.M }),
        },
        style,
      ]}
    >
      <Icon
        width={ICON_SIZE[size]}
        height={ICON_SIZE[size]}
        color={disabled ? colors.fgNeutralDisabled : resolvedIconColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.XS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: colors.bgDimStrong,
  },
  none: {
    backgroundColor: 'transparent',
  },
  xs: {
    backgroundColor: colors.bgLayerSurface,
    borderRadius: 9999,
  },
});