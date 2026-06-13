import { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';

import WaveBack from '../../assets/shared/graphic_wave_back.svg';
import WaveFront from '../../assets/shared/graphic_wave_front.svg';
import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';
import Music from './Music';

const WAVE_HEIGHT = 29;
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
        <Music
          title={title}
          artist={artist}
          imageSource={coverSource}
          button
          isPlaying={isPlaying}
          onPressButton={handlePress}
        />

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
    paddingHorizontal: padding.M,
  },
  waveContainer: {
    height: WAVE_HEIGHT,
  },
});
