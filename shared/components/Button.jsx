import { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';
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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
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
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.button, styles[buttonColor]]}
      >
        <Text style={[styles.text, styles[`${buttonColor}Text`]]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
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
  layerWeak: {
    backgroundColor: colors.bgLayerWeak,
  },
  defaultWeak: {
    backgroundColor: colors.bgDefaultWeak,
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
  }
  
});