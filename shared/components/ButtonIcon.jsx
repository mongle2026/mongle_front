import { Animated, Pressable, StyleSheet } from 'react-native';

import { useRef } from 'react';

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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
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
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          width={ICON_SIZE[size]}
          height={ICON_SIZE[size]}
          color={disabled ? colors.fgDisabled : iconColor}
        />
      </Animated.View>
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