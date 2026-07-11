import {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Img from '../../write/components/Img';

import Music from '../../../shared/components/music/Music';
import Profile from '../../../shared/components/Profile';
import LikeButton from '../home/hook/LikeButton';
import BookmarkButton from '../home/hook/BookmarkButton';
import { colors } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';
import { formatDate } from '../../../shared/utils/formatDate';

const MAX_LINES = { textFull: 10, img: 6, textShort: 6 };
const AUTO_THRESHOLD = 12;

const POST_HEIGHT = 520;

function TextLines({ content, maxLines, onPressMore }) {
  const [measurement, setMeasurement] = useState({
    content: null,
    lines: [],
  });

  if (!content) {
    return null;
  }

  const measured = measurement.content === content;

  const lines = measured
    ? measurement.lines
    : [];

  const hasMore = lines.length > maxLines;
  const visibleLines = lines.slice(0, maxLines);

  const onTextLayout = useCallback(
    event => {
      const nextLines = event.nativeEvent.lines;

      if (!nextLines?.length) {
        return;
      }

      setMeasurement(current => {
        if (current.content === content) {
          return current;
        }

        return {
          content,
          lines: nextLines,
        };
      });
    },
    [content],
  );

  return (
    <View style={styles.textLinesWrapper}>
      {!measured && (
        <Text
          style={styles.lineText}
          onTextLayout={onTextLayout}
        >
          {content}
        </Text>
      )}

      {measured && (
        <View style={styles.linesContainer}>
          {visibleLines.map((line, index) => {
            const isLast =
              index === visibleLines.length - 1;

            return (
              <View
                key={`${content}-${index}`}
                style={styles.lineRow}
              >
                <Text
                  style={styles.lineText}
                  numberOfLines={1}
                >
                  {line.text.trimEnd()}
                </Text>

                {hasMore && isLast && (
                  <Pressable
                    style={styles.moreButton}
                    onPress={onPressMore}
                  >
                    <Text style={styles.moreText}>
                      더보기
                    </Text>
                  </Pressable>
                )}

                <View style={styles.underline} />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const DOUBLE_TAP_DELAY = 200;
const DOUBLE_TAP_COOLDOWN = 350;

export default function Post({
  type = 'textFull',
  currentView = true,
  musicTitle,
  musicArtist,
  musicCover,
  musicAudioUri,
  musicId,
  activeMusicId,
  onChangeActiveMusic,
  content = '',
  images = [],
  name = '수신인 선택',
  id,
  date = '',
  profileSource,
  isBookmarked = false,
  isLiked = false,
  onPressBookmark,
  onPressLike,
  onPressBody,
}) {
  // type: 'textFull' | 'img'
  // textFull — 텍스트만, 최대 12줄, 고정 높이 없음
  // img      — 이미지 포함 (텍스트+이미지 or 이미지만), 고정 높이 520, 텍스트 최대 6줄
  // textFull — 텍스트만, 고정 높이 550, 최대 12줄

  const lastTapRef = useRef(0);
  const tapTimerRef = useRef(null);
  const likeRef = useRef(null);
  const lastToggleRef = useRef(0);
  const showImages = type === 'img' && images.length > 0;

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
    };
  }, []);

  // 카드 press 피드백: 누르는 동안 살짝 축소(0.98) → 떼면 원래대로
  const pressScale = useSharedValue(1);
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));
  const handlePressIn = useCallback(() => {
    pressScale.value = withTiming(0.98, { duration: 100 });
  }, [pressScale]);
  const handlePressOut = useCallback(() => {
    pressScale.value = withTiming(1, { duration: 150 });
  }, [pressScale]);

  const handleBodyPress = useCallback(() => {
    const now = Date.now();

    // 방금 더블탭 토글이 일어났으면, OS가 중복 전달한 여분의 탭을 무시 (like+unlike 상쇄 방지)
    if (now - lastToggleRef.current < DOUBLE_TAP_COOLDOWN) {
      return;
    }

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;

      lastTapRef.current = 0;
      lastToggleRef.current = now;

      // 더블탭: 하트 바운스 + 좋아요 토글 (안 눌렀으면 좋아요, 이미 눌렀으면 취소)
      likeRef.current?.bounce();
      onPressLike?.();
    } else {
      lastTapRef.current = now;
      tapTimerRef.current = setTimeout(() => {
        onPressBody?.();
      }, DOUBLE_TAP_DELAY);
    }
  }, [onPressLike, onPressBody]);

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'img' ? styles.fixedHeight : styles.fixedHeightText,
        !currentView && styles.dimmed,
        cardAnimatedStyle,
      ]}
    >
      {!currentView && (
        <Pressable style={styles.focusOverlay} onPress={onPressBody} />
      )}

      {/* 음악 */}
      <Music
        title={musicTitle}
        artist={musicArtist}
        imageSource={musicCover}
        button
        audioUri={musicAudioUri}
        musicId={musicId}
        activeMusicId={activeMusicId}
        onChangeActiveMusic={onChangeActiveMusic}
      />

      {/* 텍스트 + 이미지 */}
      <Pressable
        style={styles.body}
        onPress={handleBodyPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <TextLines
          content={content}
          maxLines={type === 'img' ? MAX_LINES.img : MAX_LINES.textFull}
          onPressMore={onPressBody}
        />

        {showImages && (
          <View style={styles.imageRow}>
            {images.slice(0, 2).map((src, i) => (
              <Img key={i} variant="ImgOnly" imageSource={src} />
            ))}
          </View>
        )}
      </Pressable>

      {/* 푸터 */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Profile name={name} id={id} imageSource={profileSource} type="id" />
          <Text style={styles.date}>{date ? formatDate(date) : ''}</Text>
        </View>
        <View style={styles.footerRight}>
          <BookmarkButton
            isBookmarked={isBookmarked}
            onPress={onPressBookmark}
          />
          <LikeButton ref={likeRef} isLiked={isLiked} onPress={onPressLike} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.bgLayerDefault,
    paddingTop: padding.S,
    paddingBottom: padding.M,
    gap: gap.M,
    borderRadius: radius.M,
    overflow: 'hidden',
  },
  fixedHeight: {
    height: POST_HEIGHT,
  },

  fixedHeightText: {
    height: POST_HEIGHT,
  },
  focusOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  dimmed: {
    opacity: 0.1,
  },
  body: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: padding.L,
    gap: gap.M,
  },

  // TextLines
  textLinesWrapper: {
    alignSelf: 'stretch',
  },
  linesContainer: {
    alignSelf: 'stretch',
    gap: gap.M,
  },
  lineRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    gap: gap.XS,
  },
  lineText: {
    alignSelf: 'stretch',
    textAlign: 'justify',
    ...typo.bodyMedium,
    color: colors.fgLayerNeutral,
  },
  underline: {
    height: 1,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: colors.strokeNeutralWeak,
  },
  // Images
  imageRow: {
    flexDirection: 'row',
    gap: gap.S,
    paddingVertical: padding.S,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: padding.M,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: padding.S,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  date: {
    ...typo.captionSmall,
    color: colors.fgNeutralWeak,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    position: 'absolute',
    right: 0,
    bottom: gap.XS + 1,
    backgroundColor: colors.bgLayerDefault,
    paddingLeft: gap.S,
  },
  moreText: {
    ...typo.bodySmall,
    color: colors.fgPlaceholder,
  },
});
