import { useRef, useEffect, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import WaveBack from '../../assets/shared/graphic_wave_back.svg';
import WaveFront from '../../assets/shared/graphic_wave_front.svg';
import PlayFillIcon from '../../assets/icons/ic_play_fill.svg';
import PauseFillIcon from '../../assets/icons/ic_pause_fill.svg';
import { colors, palette } from '../styles/color';
import { gap, padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

const WAVE_WIDTH = 327;
const WAVE_HEIGHT = 29;
const ICON_SIZE = 32;
const DURATION = 30;

const DEFAULT_COVER = require('../../assets/write/cover_img.png');

export default function MusicPlay({
  title = '음악 선택',
  artist = 'Honne',
  imageSource,
  onPressPlay,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const elapsedRef = useRef(0); // 멈춘 위치 기억
  const progressAnim = useRef(new Animated.Value(0)).current;

  const waveWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WAVE_WIDTH],
  });

  const startPlayback = () => {
    setIsPlaying(true);

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

  const stopPlayback = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
    // elapsedRef는 유지 → 재개 시 이어서 진행
  };

  const handlePress = () => {
    onPressPlay?.();
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const coverSource = imageSource
    ? typeof imageSource === 'string' ? { uri: imageSource } : imageSource
    : DEFAULT_COVER;

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        {/* 음악 정보 */}
        <View style={styles.row}>
          <Image source={coverSource} style={styles.cover} resizeMode="cover" />
          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
          </View>
          <Pressable style={styles.playButton} onPress={handlePress}>
            {isPlaying
              ? <PauseFillIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.fgLayerNeutral} />
              : <PlayFillIcon  width={ICON_SIZE} height={ICON_SIZE} color={colors.fgLayerNeutral} />
            }
          </Pressable>
        </View>

        {/* 파형 */}
        <View style={styles.waveContainer}>
          {/* 회색 전체 파형 (배경) */}
          <WaveBack width={WAVE_WIDTH} height={WAVE_HEIGHT} style={StyleSheet.absoluteFill} />
          {/* 진행된 만큼 진한 파형 클리핑 */}
          <Animated.View style={{ width: waveWidth, height: WAVE_HEIGHT, overflow: 'hidden' }}>
            <WaveFront width={WAVE_WIDTH} height={WAVE_HEIGHT} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    paddingHorizontal: padding.XL,
    paddingVertical: padding.M,
  },
  card: {
    borderRadius: radius.XL,
    paddingTop: padding.S,
    paddingBottom: padding.M,
    backgroundColor: colors.bgLayerWeak,
    alignItems: 'center',
    gap: gap.XS,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
    gap: gap.L,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: radius.XS,
  },
  texts: {
    flex: 1,
    gap: gap.XS,
  },
  title: {
    ...typo.titleXSmall,
    color: colors.fgLayerNeutral,
    textAlign: 'left',
  },
  artist: {
    ...typo.captionSmall,
    color: colors.fgLayerNeutralWeak,
    textAlign: 'left',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveContainer: {
    width: WAVE_WIDTH,
    height: WAVE_HEIGHT,
  },
});
