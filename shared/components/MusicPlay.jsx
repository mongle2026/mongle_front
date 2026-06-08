import { useRef, useEffect } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import WaveBack from '../../assets/shared/graphic_wave_back.svg';
import WaveFront from '../../assets/shared/graphic_wave_front.svg';
import PlayFillIcon from '../../assets/icons/ic_play_fill.svg';
import PauseFillIcon from '../../assets/icons/ic_pause_fill.svg';
import { colors, palette } from '../styles/color';
import { gap, padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

const WAVE_WIDTH = 327;
const WAVE_HEIGHT = 29;
const BUTTON_SIZE = 40;
const ICON_SIZE = 32;

const DEFAULT_COVER = require('../../assets/write/cover_img.png');

export default function MusicPlay({
  title = '음악 선택',
  artist = 'Honne',
  imageSource,
  isPlaying = false,
  progress = 0, // 0~1
  onPressPlay,
}) {
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const waveWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WAVE_WIDTH],
  });

  const coverSource = imageSource
    ? typeof imageSource === 'string'
      ? { uri: imageSource }
      : imageSource
    : DEFAULT_COVER;

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        {/* Music row */}
        <View style={styles.row}>
          <Image source={coverSource} style={styles.cover} resizeMode="cover" />

          <View style={styles.texts}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {artist}
            </Text>
          </View>

          <Pressable style={styles.playButton} onPress={onPressPlay}>
            {isPlaying ? (
              <PlayFillIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={colors.fgLayerNeutral}
              />
            ) : (
              <PauseFillIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={colors.fgLayerNeutral}
              />
            )}
          </Pressable>
        </View>

        {/* Waveform */}
        <View style={styles.waveContainer}>
          <WaveBack
            width={WAVE_WIDTH}
            height={WAVE_HEIGHT}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.waveFrontClip, { width: waveWidth }]}>
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
    borderRadius: BUTTON_SIZE / 2,
    padding: padding.S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveContainer: {
    width: WAVE_WIDTH,
    height: WAVE_HEIGHT,
  },
  waveFrontClip: {
    height: WAVE_HEIGHT,
    overflow: 'hidden',
  },
});
