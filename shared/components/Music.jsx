import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, View, StyleSheet, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import PlayFillIcon from '../../assets/icons/ic_play_fill.svg';
import PauseFillIcon from '../../assets/icons/ic_pause_fill.svg';
import { colors, palette } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';
import ButtonIcon from './ButtonIcon';

const DEFAULT_COVER_IMAGE = require('../../assets/write/cover_img.png');

export default function Music({
  title,
  artist = '가수명',
  imageSource,
  audioUri,
  musicId,
  activeMusicId,
  onChangeActiveMusic,
  isPlaying: externalIsPlaying,
  onPressButton,
  button = false,
  empty = false,
  onPress,
  style,
  buttonStyle,
}) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const wasActiveMusicRef = useRef(false);
  const loadedAudioUriRef = useRef(null);
  const isFinishedRef = useRef(false);

  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const hasExternalControl = typeof externalIsPlaying === 'boolean';
  const currentIsPlaying = hasExternalControl ? externalIsPlaying : internalIsPlaying;

  const isActiveMusic = activeMusicId === musicId;
  const shouldShowPauseIcon = hasExternalControl
    ? currentIsPlaying
    : isActiveMusic && currentIsPlaying;

  const currentImageSource = typeof imageSource === 'string'
    ? { uri: imageSource }
    : imageSource ?? DEFAULT_COVER_IMAGE;

  const pauseMusic = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      console.log('audio pause ignored:', error?.message);
    }

    setInternalIsPlaying(false);
  }, [player]);

  const resetMusic = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch (error) {
      console.log('audio reset ignored:', error?.message);
    }

    setInternalIsPlaying(false);
    isFinishedRef.current = false;
  }, [player]);

  const playMusic = useCallback(() => {
    if (!audioUri) {
      return;
    }

    try {
      const isNewAudio = loadedAudioUriRef.current !== audioUri;

      if (isNewAudio) {
        player.replace({ uri: audioUri });
        loadedAudioUriRef.current = audioUri;
        isFinishedRef.current = false;
      }

      if (isFinishedRef.current) {
        player.seekTo(0);
        isFinishedRef.current = false;
      }

      player.play();

      setInternalIsPlaying(true);
      onChangeActiveMusic?.(musicId);
    } catch (error) {
      console.log('audio play failed:', error?.message);
      setInternalIsPlaying(false);
    }
  }, [audioUri, musicId, onChangeActiveMusic, player]);

  const onPressMusicButton = useCallback(() => {
    if (onPressButton) {
      onPressButton();
      return;
    }

    if (!audioUri) {
      return;
    }

    if (isActiveMusic && currentIsPlaying) {
      pauseMusic();
      return;
    }

    playMusic();
  }, [
    onPressButton,
    audioUri,
    isActiveMusic,
    currentIsPlaying,
    pauseMusic,
    playMusic,
  ]);

  useEffect(() => {
    if (hasExternalControl) {
      return;
    }

    if (isActiveMusic) {
      wasActiveMusicRef.current = true;
      return;
    }

    if (!wasActiveMusicRef.current) {
      return;
    }

    resetMusic();
    wasActiveMusicRef.current = false;
  }, [
    hasExternalControl,
    isActiveMusic,
    resetMusic,
  ]);

  useEffect(() => {
    if (hasExternalControl) {
      return;
    }

    if (status.didJustFinish) {
      setInternalIsPlaying(false);
      isFinishedRef.current = true;
      onChangeActiveMusic?.(null);
    }
  }, [
    hasExternalControl,
    status.didJustFinish,
    onChangeActiveMusic,
  ]);

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable style={styles.container} onPress={onPress} disabled={!onPress}>
        {!empty && (
          <Image
            source={currentImageSource}
            style={styles.cover}
            resizeMode="cover"
          />
        )}

        <View style={styles.textContainer}>
          <Text style={empty ? styles.titleEmpty : styles.title} numberOfLines={1}>
            {title ?? (empty ? '음악 선택' : '노래 제목')}
          </Text>

          {!empty && (
            <Text style={styles.artist} numberOfLines={1}>
              {artist}
            </Text>
          )}
        </View>

        {button && !empty && (
          <Animated.View style={buttonStyle}>
            <ButtonIcon
              Icon={shouldShowPauseIcon ? PauseFillIcon : PlayFillIcon}
              size="XL"
              variant="none"
              iconColor={colors.fgLayerNeutral}
              onPress={onPressMusicButton}
            />
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.M,
    gap: gap.L,
    borderRadius: radius.M,
    backgroundColor: colors.bgLayerWeak,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: radius.XS,
  },
  coverEmpty: {
    width: 56,
    height: 56,
    borderRadius: radius.XS,
    backgroundColor: colors.bgLayerWeak,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: gap.XS,
  },
  title: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  titleEmpty: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  artist: {
    ...typo.captionSmall,
    color: palette.grayOpacity[50],
    alignSelf: 'stretch',
    textAlign: 'left',
  },
});