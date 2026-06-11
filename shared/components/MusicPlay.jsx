import { useRef, useEffect, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';

import WaveBack from '../../assets/shared/graphic_wave_back.svg';
import WaveFront from '../../assets/shared/graphic_wave_front.svg';
import PlayFillIcon from '../../assets/icons/ic_play_fill.svg';
import PauseFillIcon from '../../assets/icons/ic_pause_fill.svg';
import { colors, palette } from '../styles/color';
import { gap, padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

const WAVE_HEIGHT = 29;
const ICON_SIZE = 32;
const DURATION = 30;

const DEFAULT_COVER = require('../../assets/write/cover_img.png');

export default function MusicPlay({
  title = '음악 선택',
  artist = 'Honne',
  imageSource,
  audioUri,
  onPressPlay,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveContainerWidth, setWaveContainerWidth] = useState(0);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const elapsedRef = useRef(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const waveWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, waveContainerWidth],
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
        <View style={styles.waveOuter}>
          <View
            style={styles.waveContainer}
            onLayout={(e) => setWaveContainerWidth(e.nativeEvent.layout.width)}
          >
            <WaveBack width={waveContainerWidth} height={WAVE_HEIGHT} style={StyleSheet.absoluteFill} />
            <Animated.View style={{ width: waveWidth, height: WAVE_HEIGHT, overflow: 'hidden' }}>
              <WaveFront width={waveContainerWidth} height={WAVE_HEIGHT} />
            </Animated.View>
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
    ...typo.titleMedium,
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
  waveOuter: {
    alignSelf: 'stretch',
    paddingHorizontal: padding.M,
  },
  waveContainer: {
    height: WAVE_HEIGHT,
  },
});
