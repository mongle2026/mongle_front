import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors } from '../../styles/color';
import { padding, radius } from '../../styles/token';

import MusicInfo from './MusicInfo';
import useMusicPlayer from './useMusicPlayer';

const WAVE_HEIGHT = 29;
const CANDLE_WIDTH = 2;
const CANDLE_SPACE = 5;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateBars(count) {
  const rand = seededRandom(42);
  return Array.from({ length: count }, () =>
    Math.round(3 + rand() * (WAVE_HEIGHT - 3))
  );
}

export default function MusicPlay({
  title = '음악 선택',
  artist = '가수명',
  imageSource,
  audioUri,
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const {
    isPlaying,
    progress,
    toggle,
  } = useMusicPlayer({
    audioUri,
  });

  const visibleBars = containerWidth > 0
    ? Math.floor(containerWidth / (CANDLE_WIDTH + CANDLE_SPACE))
    : 0;

  const bars = useMemo(() => generateBars(visibleBars), [visibleBars]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const filledWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth],
  });

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        <MusicInfo
          title={title}
          artist={artist}
          imageSource={imageSource}
          button
          isPlaying={isPlaying}
          onPressButton={toggle}
        />

        <View style={styles.waveOuter}>
          <View
            style={styles.waveInner}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          >
            {visibleBars > 0 && (
              <>
                <View style={styles.waveRow}>
                  {bars.map((height, index) => (
                    <View
                      key={index}
                      style={[
                        styles.candle,
                        {
                          height,
                          backgroundColor: colors.fgNeutralWeak,
                        },
                      ]}
                    />
                  ))}
                </View>

                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      width: filledWidth,
                      overflow: 'hidden',
                    },
                  ]}
                >
                  <View style={[styles.waveRow, { width: containerWidth }]}>
                    {bars.map((height, index) => (
                      <View
                        key={index}
                        style={[
                          styles.candle,
                          {
                            height,
                            backgroundColor: colors.fgLayerNeutralWeak,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </Animated.View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    paddingHorizontal: padding.XL,
    paddingTop: padding.S,
    paddingBottom: padding.M,
  },
  card: {
    borderRadius: radius.XL,
    paddingTop: padding.S,
    paddingBottom: padding.M,
    backgroundColor: colors.bgLayerWeak,
    alignItems: 'center',
  },
  waveOuter: {
    alignSelf: 'stretch',
    paddingHorizontal: padding.XL,
    paddingBottom: padding.M,
  },
  waveInner: {
    height: WAVE_HEIGHT,
    overflow: 'hidden',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WAVE_HEIGHT,
    gap: CANDLE_SPACE,
  },
  candle: {
    width: CANDLE_WIDTH,
    borderRadius: 2,
  },
});