import { useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Keyboard,
} from 'react-native';

import Profile from '../../../../shared/components/Profile';
import CommentIcon from '../../../../assets/icons/ic_comment.svg';
import { colors, palette } from '../../../../shared/styles/color';
import { padding, gap, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';

import useCommentLongPressAnimation, {
  LONG_PRESS_DELAY,
} from '../hook/useCommentLongPressAnimation';

export default function Comment({
  userCode,
  comment,
  createdAt,
  profileImageUrl,
  depth = 0,
  isDeleteMode = false,
  onPress,
  onOpenDeleteMode,
  onCloseDeleteMode,
  measureRelativeToRef,
  isKeyboardVisible,
}) {
  const isReply = depth === 1;

  const {
    containerRef,
    backgroundColor,
    startPressBackground,
    resetPressBackground,
    openDeleteMode,
    handlePress,
  } = useCommentLongPressAnimation({
    isDeleteMode,
    onOpenDeleteMode,
    onCloseDeleteMode,
    measureRelativeToRef,
  });

  const waitingForKeyboardRef = useRef(false);
  const keyboardHideSubscriptionRef = useRef(null);
  const measureFrameRef = useRef(null);

  const latestOpenDeleteModeRef = useRef(openDeleteMode);
  latestOpenDeleteModeRef.current = openDeleteMode;

  useEffect(() => {
    return () => {
      keyboardHideSubscriptionRef.current?.remove();

      if (measureFrameRef.current !== null) {
        cancelAnimationFrame(measureFrameRef.current);
      }
    };
  }, []);

  const handleLongPress = () => {
    const keyboardIsOpen = isKeyboardVisible?.() ?? false;

    if (!keyboardIsOpen) {
      latestOpenDeleteModeRef.current();
      return;
    }

    waitingForKeyboardRef.current = true;

    keyboardHideSubscriptionRef.current?.remove();

    keyboardHideSubscriptionRef.current = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        keyboardHideSubscriptionRef.current?.remove();
        keyboardHideSubscriptionRef.current = null;

        measureFrameRef.current = requestAnimationFrame(() => {
          measureFrameRef.current = null;
          waitingForKeyboardRef.current = false;

          latestOpenDeleteModeRef.current();
        });
      }
    );

    Keyboard.dismiss();
  };

  const handlePressOut = () => {
    if (waitingForKeyboardRef.current) {
      return;
    }

    resetPressBackground();
  };

  const handleReplyPress = () => {
    if (isDeleteMode) {
      return;
    }

    onPress?.();
  };

  return (
    <View
      ref={containerRef}
      collapsable={false}
      style={[
        styles.container,
        isReply && styles.replyContainer,
      ]}
    >
      <Pressable
        onPressIn={startPressBackground}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={handleLongPress}
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

            <View style={styles.dateRow}>
              <Text style={styles.date}>{createdAt}</Text>

              <Pressable
                onPress={handleReplyPress}
                hitSlop={8}
                accessibilityRole="button"
                style={styles.buttonReply}
              >
                <CommentIcon
                  width="12"
                  height="12"
                />
                <Text style={styles.replyText}>답글 달기</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Pressable>
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

  activeContainer: {
    zIndex: 20,
    elevation: 20,
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

  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: gap.M,
    alignSelf: 'stretch',
  },

  date: {
    ...typo.captionSmall,
    color: palette.gray[40],
  },

  buttonReply: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
  },

  replyText: {
    ...typo.captionSmall,
    color: colors.fgLayerNeutral,
  },

});