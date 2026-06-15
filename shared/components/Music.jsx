import { useCallback, useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, Pressable } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

import PlayFillIcon from '../../assets/icons/ic_play_fill.svg';
import PauseFillIcon from '../../assets/icons/ic_pause_fill.svg';
import { colors } from '../styles/color';
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
  button = false,
  empty = false,
  onPress,
  style,
}) {
  const player = useAudioPlayer(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isActiveMusic = activeMusicId === musicId;

  const currentImageSource = typeof imageSource === 'string'
    ? { uri: imageSource }
    : imageSource ?? DEFAULT_COVER_IMAGE;

  const pauseMusic = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      console.log('audio pause ignored:', error?.message);
    }

    setIsPlaying(false);
  }, [player]);

  const playMusic = useCallback(() => {
    if (!audioUri) {
      return;
    }

    try {
      player.replace(audioUri);
      player.seekTo(0);
      player.play();

      setIsPlaying(true);
      onChangeActiveMusic?.(musicId);
    } catch (error) {
      console.log('audio play failed:', error?.message);
      setIsPlaying(false);
    }
  }, [audioUri, musicId, onChangeActiveMusic, player]);

  const onPressMusicButton = useCallback(() => {
    if (!audioUri) {
      return;
    }

    if (isActiveMusic && isPlaying) {
      pauseMusic();
      onChangeActiveMusic?.(null);
      return;
    }

    playMusic();
  }, [
    audioUri,
    isActiveMusic,
    isPlaying,
    pauseMusic,
    playMusic,
    onChangeActiveMusic,
  ]);

  useEffect(() => {
    if (!isActiveMusic && isPlaying) {
      pauseMusic();
    }
  }, [isActiveMusic, isPlaying, pauseMusic]);

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
          <ButtonIcon
            Icon={isActiveMusic && isPlaying ? PauseFillIcon : PlayFillIcon}
            size="XL"
            variant="none"
            iconColor={colors.fgLayerNeutral}
            onPress={onPressMusicButton}
          />
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
    color: colors.fgPlaceholder,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
});