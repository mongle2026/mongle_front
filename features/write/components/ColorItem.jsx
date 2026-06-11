import { useRef } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../../shared/styles/color';

export default function ColorItem({ color, isSelected = false, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.container}>
      <Animated.View style={{ transform: [{ scale }], width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.circle, isSelected && styles.circleSelected, { backgroundColor: color }]} />
        {isSelected && <View style={styles.border} pointerEvents="none" />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  circleSelected: {
    opacity: 0.7,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.strokeNeutralWeak,
  },
});
