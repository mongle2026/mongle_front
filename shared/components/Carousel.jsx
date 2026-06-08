import { useRef, useState, useCallback } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { colors, palette } from '../styles/color';
import {gap,padding} from '../styles/token.js'

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMG_HEIGHT = 375;

export default function Carousel({ images = [], style }) {
  const clipped = images.slice(0, 2);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = useCallback((e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }, []);

  if (!clipped.length) return null;

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={clipped.length === 2}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {clipped.map((src, i) => (
          <Image
            key={i}
            source={typeof src === 'string' ? { uri: src } : src}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {clipped.length === 2 && (
        <View style={styles.dots}>
          {clipped.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: padding.XL,
    alignItems: 'center',
    gap: gap.M,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMG_HEIGHT,
  },
  dots: {
    flexDirection: 'row',
    gap: gap.S,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: colors.fgNeutralWeak,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 6,
    backgroundColor: colors.fgLayerNeutral,
  },
});
