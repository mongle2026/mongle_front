import { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, Platform } from 'react-native';

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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
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
      style={[styles.button, style]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={[styles.text, styles[textType]]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
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