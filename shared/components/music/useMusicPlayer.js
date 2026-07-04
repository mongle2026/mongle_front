import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export default function useMusicPlayer({
  audioUri,
  musicId,
  activeMusicId,
  onChangeActiveMusic,
} = {}) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const loadedAudioUriRef = useRef(null);
  const wasActiveMusicRef = useRef(false);
  const isFinishedRef = useRef(false);

  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const isActiveMusic = activeMusicId === undefined
    ? true
    : activeMusicId === musicId;

  const isPlaying = isActiveMusic && internalIsPlaying;

  const progress = status.duration
    ? Math.min(status.currentTime / status.duration, 1)
    : 0;

  const pause = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      console.log('audio pause ignored:', error?.message);
    }

    setInternalIsPlaying(false);
  }, [player]);

  const reset = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch (error) {
      console.log('audio reset ignored:', error?.message);
    }

    setInternalIsPlaying(false);
    isFinishedRef.current = false;
  }, [player]);

  const play = useCallback(() => {
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

  const toggle = useCallback(() => {
    if (!audioUri) {
      return;
    }

    if (isPlaying) {
      pause();
      return;
    }

    play();
  }, [audioUri, isPlaying, pause, play]);

  // 파형에서 터치/드래그한 위치(0~1 비율)로 재생 위치 이동
  const seek = useCallback(
    (ratio, { autoPlay = false } = {}) => {
      if (!audioUri) {
        return;
      }

      const clamped = Math.max(0, Math.min(ratio, 1));

      try {
        const isNewAudio = loadedAudioUriRef.current !== audioUri;

        if (isNewAudio) {
          player.replace({ uri: audioUri });
          loadedAudioUriRef.current = audioUri;
        }

        const target = (status.duration ?? 0) * clamped;
        player.seekTo(target);
        isFinishedRef.current = false;

        if (autoPlay) {
          player.play();
          setInternalIsPlaying(true);
          onChangeActiveMusic?.(musicId);
        }
      } catch (error) {
        console.log('audio seek failed:', error?.message);
      }
    },
    [audioUri, player, status.duration, musicId, onChangeActiveMusic],
  );

  useEffect(() => {
    if (activeMusicId === undefined) {
      return;
    }

    if (isActiveMusic) {
      wasActiveMusicRef.current = true;
      return;
    }

    if (!wasActiveMusicRef.current) {
      return;
    }

    reset();
    wasActiveMusicRef.current = false;
  }, [activeMusicId, isActiveMusic, reset]);

  useEffect(() => {
    if (status.didJustFinish) {
      setInternalIsPlaying(false);
      isFinishedRef.current = true;
      onChangeActiveMusic?.(null);
    }
  }, [status.didJustFinish, onChangeActiveMusic]);

  return {
    isPlaying,
    progress,
    play,
    pause,
    reset,
    toggle,
    seek,
  };
}