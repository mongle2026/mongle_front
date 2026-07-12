import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { colors } from '../../../../shared/styles/color';

export const LONG_PRESS_DELAY = 450;

const BACKGROUND_CLOSE_DURATION = 120;
const DELETE_MODE_CLOSE_DURATION = 120;

const POSITION_EPSILON = 0.5;
const MAX_MEASURE_ATTEMPTS = 10;

export default function useCommentLongPressAnimation({
  isDeleteMode,
  onOpenDeleteMode,
  onCloseDeleteMode,
  measureRelativeToRef,
}) {
  const containerRef = useRef(null);

  const backgroundProgress =
    useRef(new Animated.Value(0)).current;

  const isLongPressedRef = useRef(false);
  const measureFrameRef = useRef(null);
  const isMountedRef = useRef(true);

  /*
   * 키보드가 내려가는 동안 부모가 다시 렌더링되면
   * onOpenDeleteMode도 새 함수로 변경됩니다.
   *
   * 좌표 측정이 끝난 시점의 최신 함수를 사용해야
   * 최신 bottomValue로 위/아래 위치를 판단할 수 있습니다.
   */
  const latestOnOpenDeleteModeRef =
    useRef(onOpenDeleteMode);

  latestOnOpenDeleteModeRef.current =
    onOpenDeleteMode;

  const backgroundColor = backgroundProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colors.bgLayerDefault,
      colors.bgLayerSurface,
    ],
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (measureFrameRef.current !== null) {
        cancelAnimationFrame(measureFrameRef.current);
      }
    };
  }, []);

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

  const measureContainer = useCallback(
    callback => {
      const containerNode = containerRef.current;
      const screenNode = measureRelativeToRef?.current;

      if (!containerNode?.measureInWindow) {
        return false;
      }

      if (screenNode?.measureInWindow) {
        screenNode.measureInWindow(
          (screenX, screenY) => {
            if (!isMountedRef.current) {
              return;
            }

            containerNode.measureInWindow(
              (x, y, width, height) => {
                if (!isMountedRef.current) {
                  return;
                }

                callback({
                  x: x - screenX,
                  y: y - screenY,
                  width,
                  height,
                });
              }
            );
          }
        );

        return true;
      }

      containerNode.measureInWindow(
        (x, y, width, height) => {
          if (!isMountedRef.current) {
            return;
          }

          callback({
            x,
            y,
            width,
            height,
          });
        }
      );

      return true;
    },
    [measureRelativeToRef]
  );

  const openDeleteMode = useCallback(() => {
    isLongPressedRef.current = true;

    backgroundProgress.stopAnimation();
    backgroundProgress.setValue(1);

    if (measureFrameRef.current !== null) {
      cancelAnimationFrame(measureFrameRef.current);
      measureFrameRef.current = null;
    }

    const measureUntilStable = (
      previousLayout = null,
      attempt = 0
    ) => {
      const measurementStarted = measureContainer(
        currentLayout => {
          const positionIsStable =
            previousLayout !== null &&
            Math.abs(
              currentLayout.x - previousLayout.x
            ) <= POSITION_EPSILON &&
            Math.abs(
              currentLayout.y - previousLayout.y
            ) <= POSITION_EPSILON &&
            Math.abs(
              currentLayout.height -
              previousLayout.height
            ) <= POSITION_EPSILON;

          if (
            positionIsStable ||
            attempt >= MAX_MEASURE_ATTEMPTS
          ) {
            measureFrameRef.current = null;

            latestOnOpenDeleteModeRef.current?.(
              currentLayout
            );

            return;
          }

          measureFrameRef.current =
            requestAnimationFrame(() => {
              measureUntilStable(
                currentLayout,
                attempt + 1
              );
            });
        }
      );

      if (!measurementStarted) {
        measureFrameRef.current = null;
        isLongPressedRef.current = false;
      }
    };

    measureFrameRef.current =
      requestAnimationFrame(() => {
        measureUntilStable();
      });
  }, [
    backgroundProgress,
    measureContainer,
  ]);

  const handlePress = useCallback(() => {
    if (isLongPressedRef.current) {
      return;
    }

    if (isDeleteMode) {
      onCloseDeleteMode?.();
    }
  }, [
    isDeleteMode,
    onCloseDeleteMode,
  ]);

  return {
    containerRef,
    backgroundColor,
    startPressBackground,
    resetPressBackground,
    openDeleteMode,
    handlePress,
  };
}