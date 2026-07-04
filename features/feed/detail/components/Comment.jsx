import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import Profile from '../../../../shared/components/Profile';
import Button from '../../../../shared/components/Button';
import { colors, palette } from '../../../../shared/styles/color';
import { padding, gap, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';

const LONG_PRESS_DELAY = 450;
const BACKGROUND_CLOSE_DURATION = 120;
const DELETE_BUTTON_OPEN_DURATION = 60;
const DELETE_MODE_CLOSE_DURATION = 120;

export default function Comment({
  userCode,
  comment,
  createdAt,
  profileImageUrl,
  depth = 0,
  onPress,
  onDeletePress,
}) {
  const isReply = depth === 1;

  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const backgroundProgress = useRef(new Animated.Value(0)).current;
  const deleteButtonProgress = useRef(new Animated.Value(0)).current;
  const isLongPressedRef = useRef(false);
  const ignoreCloseUntilRef = useRef(0);

  const backgroundColor = backgroundProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bgLayerDefault, colors.bgLayerSurface],
  });

  const startPressBackground = () => {
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
  };

  const resetPressBackground = () => {
    if (isDeleteMode) {
      if (isLongPressedRef.current) {
        ignoreCloseUntilRef.current = Date.now() + 250;
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
  };

  const openDeleteMode = () => {
    isLongPressedRef.current = true;

    setIsDeleteMode(true);

    backgroundProgress.stopAnimation();
    backgroundProgress.setValue(1);

    deleteButtonProgress.stopAnimation();
    deleteButtonProgress.setValue(0);

    Animated.timing(deleteButtonProgress, {
      toValue: 1,
      duration: DELETE_BUTTON_OPEN_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const closeDeleteMode = () => {
    backgroundProgress.stopAnimation();
    deleteButtonProgress.stopAnimation();

    Animated.parallel([
      Animated.timing(backgroundProgress, {
        toValue: 0,
        duration: DELETE_MODE_CLOSE_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(deleteButtonProgress, {
        toValue: 0,
        duration: DELETE_MODE_CLOSE_DURATION,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsDeleteMode(false);
        isLongPressedRef.current = false;
      }
    });
  };

  const handlePress = () => {
    if (isLongPressedRef.current) {
      return;
    }

    if (isDeleteMode) {
      closeDeleteMode();
      return;
    }

    onPress?.();
  };

  const handleDeletePress = () => {
    onDeletePress?.();
    closeDeleteMode();
  };

  return (
    <View
      style={[
        styles.container,
        isReply && styles.replyContainer,
      ]}
    >
      <Pressable
        onPressIn={startPressBackground}
        onPressOut={resetPressBackground}
        onPress={handlePress}
        onLongPress={openDeleteMode}
        delayLongPress={LONG_PRESS_DELAY}
        style={styles.pressable}
      >
        <Animated.View
          style={[
            styles.contentRow,
            {
              backgroundColor,
            },
            isDeleteMode && styles.activeContentRow,
          ]}
        >
          <Profile
            imageSource={profileImageUrl}
            imageOnly
            style={styles.profile}
          />

          <View style={styles.containerTexts}>
            <Text style={styles.userId}>@{userCode}</Text>
            <Text style={styles.comment}>{comment}</Text>
            <Text style={styles.date}>{createdAt}</Text>
          </View>
        </Animated.View>
      </Pressable>

      {isDeleteMode && (
        <View pointerEvents="box-none" style={styles.deleteOverlay}>
          <Animated.View
            style={{
              opacity: deleteButtonProgress,
            }}
          >
            <Button
              label="삭제하기"
              color="defaultWeak"
              onPress={handleDeletePress}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: padding.S,
    paddingRight: padding.M,
    paddingBottom: padding.S,
    paddingLeft: padding.M,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    backgroundColor: colors.bgLayerDefault,
  },

  pressable: {
    width: '100%',
  },

  profile: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  contentRow: {
    width: '100%',
    paddingHorizontal: padding.M,
    paddingVertical: padding.M,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: gap.M,
    borderRadius: radius.M,
  },

  activeContentRow: {
    borderRadius: radius.M,
  },

  replyContainer: {
    paddingLeft: 56,
  },

  containerTexts: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: gap.S,
  },

  deleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  userId: {
    ...typo.labelSmall,
    color: colors.fgLayerNeutral,
    fontVariant: ['lining-nums', 'proportional-nums'],
  },

  comment: {
    ...typo.bodySmall,
    color: colors.fgLayerNeutral,
  },

  date: {
    ...typo.captionSmall,
    color: palette.gray[40],
  },
});