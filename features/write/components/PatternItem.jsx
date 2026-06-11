import { useRef } from 'react';
import { Animated, Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../../shared/styles/color';
import { radius } from '../../../shared/styles/token';

export default function PatternItem({ thumbnail, isSelected = false, onPress }) {
  const SvgImage = thumbnail?.default ?? thumbnail;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }] }]}>
        <View style={[styles.imageWrapper, isSelected && styles.imageWrapperSelected]}>
          <SvgImage width="100%" height="100%" />
        </View>
        {isSelected && <View style={styles.border} pointerEvents="none" />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.XS,
    overflow: 'hidden',
  },

  imageWrapperSelected: {
    opacity: 0.7,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.XS,
    borderWidth: 2,
    borderColor: colors.strokeNeutralWeak,
  },
});
