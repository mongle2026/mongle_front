import { Pressable, StyleSheet } from 'react-native';

import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';

const BUTTON_SIZE = {
  S: 28,
  M: 40,
  L: 40,
  XL: 40,
};

const ICON_SIZE = {
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
  iconColor = colors.fgNeutral,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
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
        color={disabled ? colors.fgNeutralDisabled : iconColor}
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
    backgroundColor: colors.bgOverlay,
  },
  none: {
    backgroundColor: 'transparent',
  },
});