import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { shadow, colors } from '../styles/color';
import BottomNavigationItem from './BottomNavigationItem';

const ITEM_WIDTH = 64;
const PILL_WIDTH = 64;
const PILL_HEIGHT = 44;

export default function BottomNavigation({ items = [] }) {
  const activeIndex = items.findIndex((item) => item.isActive);
  const slideAnim = useRef(new Animated.Value(activeIndex * ITEM_WIDTH)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeIndex * ITEM_WIDTH,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [activeIndex]);

  return (
    <BlurView
      intensity={40}
      tint="dark"
      experimentalBlurMethod="dimezisBlurView"
      style={styles.container}
    >
      <Animated.View
        style={[styles.pill, { transform: [{ translateX: slideAnim }] }]}
      />
      {items.map((item, i) => (
        <BottomNavigationItem key={i} {...item} />
      ))}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgOverlayWeak,
    overflow: 'hidden',
    borderRadius: 200,
    ...shadow.middleDown,
  },
  pill: {
    position: 'absolute',
    left: 0,
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: 100,
    backgroundColor: colors.bgDefault,
  },
});
