import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { colors } from '../../../../shared/styles/color';

export const LONG_PRESS_DELAY = 450;

const BACKGROUND_CLOSE_DURATION = 120;
const DELETE_MODE_CLOSE_DURATION = 120;

export default function useCommentLongPressAnimation({
  isDeleteMode,
  onOpenDeleteMode,
  onCloseDeleteMode,
  measureRelativeToRef,
}) {
  const containerRef = useRef(null);
  const backgroundProgress = useRef(new Animated.Value(0)).current;
  const isLongPressedRef = useRef(false);

  const backgroundColor = backgroundProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bgLayerDefault, colors.bgLayerSurface],
  });

  useEffect(() => {
    if (isDeleteMode) {
      return;
    }

    backgroundProgress.stopAnimation();

    Animated.timing(backgroundProgress, {
      toValue: 0,
      duration: DELETE_MODE_CLOSE_DURATION,
      useNativeDriver: false,
    }).start(() => {
      isLongPressedRef.current = false;
    });
  }, [isDeleteMode, backgroundProgress]);

  const startPressBackground = useCallback(() => {
    if (isDeleteMode) {
      return;
    }

    isLongPressedRef.current = false;

    backgroundProgress.stopAnimation();

    Animated.timing(backgroundProgress, {
      toValue: 1,
      duration: LONG_PRESS_DELAY,
      useNativeDriver: false,
    }).start();
  }, [isDeleteMode, backgroundProgress]);

  const resetPressBackground = useCallback(() => {
    if (isDeleteMode) {
      if (isLongPressedRef.current) {
        isLongPressedRef.current = false;
      }

      return;
    }

    backgroundProgress.stopAnimation();

    Animated.timing(backgroundProgress, {
      toValue: 0,
      duration: BACKGROUND_CLOSE_DURATION,
      useNativeDriver: false,
    }).start();
  }, [isDeleteMode, backgroundProgress]);

  const openDeleteMode = useCallback(() => {
    isLongPressedRef.current = true;

    backgroundProgress.stopAnimation();
    backgroundProgress.setValue(1);

    const containerNode = containerRef.current;
    const screenNode = measureRelativeToRef?.current;

    if (!containerNode?.measureInWindow) {
      return;
    }

    const emitLayout = (x, y, width, height) => {
      onOpenDeleteMode?.({
        x,
        y,
        width,
        height,
      });
    };

    if (screenNode?.measureInWindow) {
      screenNode.measureInWindow((screenX, screenY) => {
        containerNode.measureInWindow((x, y, width, height) => {
          emitLayout(
            x - screenX,
            y - screenY,
            width,
            height
          );
        });
      });

      return;
    }

    containerNode.measureInWindow((x, y, width, height) => {
      emitLayout(x, y, width, height);
    });
  }, [
    backgroundProgress,
    measureRelativeToRef,
    onOpenDeleteMode,
  ]);

  const handlePress = useCallback(() => {
    if (isLongPressedRef.current) {
      return;
    }

    if (isDeleteMode) {
      onCloseDeleteMode?.();
    }
  }, [isDeleteMode, onCloseDeleteMode]);

  return {
    containerRef,
    backgroundColor,
    startPressBackground,
    resetPressBackground,
    openDeleteMode,
    handlePress,
  };
}