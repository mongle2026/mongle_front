import { useRef } from 'react';
import { Animated, Pressable, View, Image, StyleSheet } from 'react-native';
import { radius } from '../../../shared/styles/token';

export default function StampItem({ image, isSelected = false, onPress }) {
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
          {image && (
            <Image source={image} style={styles.image} resizeMode="cover" />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 105 / 154,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
  imageWrapperSelected: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
