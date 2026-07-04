import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

import { colors } from '../../styles/color';
import { padding, radius } from '../../styles/token';
import useAlbumTheme, { withOpacity } from './useAlbumTheme';

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
  const albumTheme = useAlbumTheme(imageSource, !!imageSource);

  const {
    isPlaying,
    progress,
    toggle,
    seek,
  } = useMusicPlayer({
    audioUri,
  });

  // 파형 스크럽용 refs (PanResponder는 최초 1회 생성되므로 최신 값은 ref로 읽는다)
  const containerWidthRef = useRef(0);
  const isScrubbingRef = useRef(false);
  const seekRef = useRef(seek);
  seekRef.current = seek;

  const panResponder = useRef(
    (() => {
      // 터치 x좌표 → 0~1 비율
      const toRatio = (x) => {
        const w = containerWidthRef.current;
        if (!w) return null;
        return Math.max(0, Math.min(x / w, 1));
      };

      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          isScrubbingRef.current = true;
          const r = toRatio(evt.nativeEvent.locationX);
          if (r != null) progressAnim.setValue(r);
        },
        onPanResponderMove: (evt) => {
          const r = toRatio(evt.nativeEvent.locationX);
          if (r != null) progressAnim.setValue(r);
        },
        onPanResponderRelease: (evt) => {
          isScrubbingRef.current = false;
          const r = toRatio(evt.nativeEvent.locationX);
          if (r != null) {
            progressAnim.setValue(r);
            // 놓은 위치부터 재생
            seekRef.current?.(r, { autoPlay: true });
          }
        },
        onPanResponderTerminate: () => {
          isScrubbingRef.current = false;
        },
      });
    })()
  ).current;

  const visibleBars = containerWidth > 0
    ? Math.floor(containerWidth / (CANDLE_WIDTH + CANDLE_SPACE))
    : 0;

  const bars = useMemo(() => generateBars(visibleBars), [visibleBars]);

  useEffect(() => {
    // 스크럽 중에는 손가락 위치를 따라가야 하므로 자동 애니메이션을 건너뛴다
    if (isScrubbingRef.current) {
      return;
    }

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
      <View style={[styles.card, { backgroundColor: albumTheme.backgroundColor }]}>
        <MusicInfo
          title={title}
          artist={artist}
          imageSource={imageSource}
          button
          isPlaying={isPlaying}
          onPressButton={toggle}
          albumTheme={albumTheme}
        />

        <View style={styles.waveOuter}>
          <View
            style={styles.waveTouch}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setContainerWidth(w);
              containerWidthRef.current = w;
            }}
            {...panResponder.panHandlers}
          >
            <View style={styles.waveInner}>
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
                            backgroundColor: withOpacity(albumTheme.waveColor, 0.3),
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
                              backgroundColor: withOpacity(albumTheme.waveColor, 1),
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
  // 터치 영역을 위아래로 넓혀 파형을 잡기 쉽게 한다 (가로 padding 없음 → 폭은 파형과 동일)
  waveTouch: {
    paddingVertical: padding.S,
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
