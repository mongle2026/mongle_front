import { useMemo, useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';

import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';
import Music from './Music';

const WAVE_HEIGHT = 29;
const CANDLE_WIDTH = 2;
const CANDLE_SPACE = 5;
const DURATION = 30;

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

const DEFAULT_COVER = require('../../assets/write/cover_img.png');

export default function MusicPlay({
  title = '음악 선택',
  artist = 'Honne',
  imageSource,
  audioUri,
  onPressPlay,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const elapsedRef = useRef(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const visibleBars = containerWidth > 0
    ? Math.floor(containerWidth / (CANDLE_WIDTH + CANDLE_SPACE))
    : 0;
  const bars = useMemo(() => generateBars(visibleBars), [visibleBars]);

  const filledWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth],
  });

  // 오디오 초기화
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => {
      clearInterval(intervalRef.current);
      soundRef.current?.unloadAsync();
    };
  }, []);

  const startWaveTimer = () => {
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      Animated.timing(progressAnim, {
        toValue: elapsedRef.current / DURATION,
        duration: 950,
        useNativeDriver: false,
      }).start();

      if (elapsedRef.current >= DURATION) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        elapsedRef.current = 0;
        setIsPlaying(false);
        setTimeout(() => {
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }).start();
        }, 500);
      }
    }, 1000);
  };

  const stopWaveTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handlePress = async () => {
    onPressPlay?.();

    if (isPlaying) {
      // 일시정지
      stopWaveTimer();
      await soundRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      // 재생
      if (audioUri) {
        if (!soundRef.current) {
          // 처음 재생 - 사운드 로드
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUri },
            { shouldPlay: true, positionMillis: elapsedRef.current * 1000 }
          );
          soundRef.current = sound;
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              stopWaveTimer();
              elapsedRef.current = 0;
              setIsPlaying(false);
              Animated.timing(progressAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
              }).start();
            }
          });
        } else {
          // 이어서 재생
          await soundRef.current.playFromPositionAsync(elapsedRef.current * 1000);
        }
      }
      setIsPlaying(true);
      startWaveTimer();
    }
  };

  const coverSource = imageSource
    ? typeof imageSource === 'string' ? { uri: imageSource } : imageSource
    : DEFAULT_COVER;

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        {/* 음악 정보 */}
        <Music
          title={title}
          artist={artist}
          imageSource={coverSource}
          button
          audioUri={audioUri}
          isPlaying={isPlaying}
          onPressButton={handlePress}
        />

        {/* 파형 */}
        <View style={styles.waveOuter}>
          <View
            style={styles.waveInner}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          >
            {visibleBars > 0 && (
              <>
                <View style={styles.waveRow}>
                  {bars.map((h, i) => (
                    <View key={i} style={[styles.candle, { height: h, backgroundColor: colors.fgNeutralWeak }]} />
                  ))}
                </View>
                <Animated.View style={[StyleSheet.absoluteFill, { width: filledWidth, overflow: 'hidden' }]}>
                  <View style={[styles.waveRow, { width: containerWidth }]}>
                    {bars.map((h, i) => (
                      <View key={i} style={[styles.candle, { height: h, backgroundColor: colors.fgLayerNeutralWeak }]} />
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
