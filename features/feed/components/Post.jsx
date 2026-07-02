import { useState, useCallback, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Img from '../../write/components/Img';

import Music from '../../../shared/components/music/Music';
import Profile from '../../../shared/components/Profile';
import ButtonIcon from '../../../shared/components/ButtonIcon';
import BookmarkStroke from '../../../assets/icons/ic_bookmark_stroke.svg';
import BookmarkFill from '../../../assets/icons/ic_bookmark_fill.svg';
import HeartStroke from '../../../assets/icons/ic_heart_stroke.svg';
import HeartFill from '../../../assets/icons/ic_heart_fill.svg';
import { colors, palette } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';
import { formatDate } from '../../../shared/utils/formatDate';

const MAX_LINES = { textFull: 10, img: 6, textShort: 6 };
const AUTO_THRESHOLD = 12;

function TextLines({ content, maxLines, onPressMore }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    setLines([]);
    setMeasured(false);
  }, [content]);

  const onTextLayout = useCallback((e) => {
    if (!measured) {
      setLines(e.nativeEvent.lines);
      setMeasured(true);
    }
  }, [measured]);

  if (!content) return null;

  const hasMore = lines.length > maxLines;
  const visibleLines = lines.slice(0, maxLines);

  if (!measured) {
    return (
      <Text style={[styles.lineText, { opacity: 0 }]} onTextLayout={onTextLayout}>
        {content}
      </Text>
    );
  }

  return (
    <View style={styles.linesContainer}>
      {visibleLines.map((line, i) => {
        const isLast = i === visibleLines.length - 1;
        return (
          <View key={i} style={styles.lineRow}>
            <Text style={styles.lineText} numberOfLines={1}>
              {line.text.trimEnd()}
            </Text>
            {hasMore && isLast && (
              <Pressable style={styles.moreButton} onPress={onPressMore}>
                <Text style={styles.moreText}>더보기</Text>
              </Pressable>
            )}
            <View style={styles.underline} />
          </View>
        );
      })}
    </View>
  );
}

const DOUBLE_TAP_DELAY = 300;

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
  const showImages = type === 'img' && images.length > 0;

  const handleBodyPress = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      clearTimeout(tapTimerRef.current);
      lastTapRef.current = 0;
      if (!isLiked) onPressLike?.();
    } else {
      lastTapRef.current = now;
      tapTimerRef.current = setTimeout(() => {
        onPressBody?.();
      }, DOUBLE_TAP_DELAY);
    }
  }, [isLiked, onPressLike, onPressBody]);

  return (
    <View style={[styles.container, type === 'img' ? styles.fixedHeight : styles.fixedHeightText, !currentView && styles.dimmed]}>
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
      <Pressable style={styles.body} onPress={handleBodyPress}>
        <TextLines
          content={content}
          maxLines={type === 'img' ? MAX_LINES.img : MAX_LINES.textFull}
          onPressMore={onPressBody}
        />

        {showImages && (
          <View style={styles.imageRow}>
            {images.slice(0, 2).map((src, i) => (
              <Img
                key={i}
                variant="ImgOnly"
                imageSource={src}
              />
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
          <ButtonIcon
            Icon={isBookmarked ? BookmarkFill : BookmarkStroke}
            size="L"
            variant="none"
            iconColor={isBookmarked ? colors.fgBrand : palette.gray[30]}
            onPress={onPressBookmark}
          />
          <ButtonIcon
            Icon={isLiked ? HeartFill : HeartStroke}
            size="L"
            variant="none"
            iconColor={isLiked ? palette.pink[50] : palette.gray[30]}
            onPress={onPressLike}
          />
        </View>
      </View>

    </View>
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
    height: 520,
  },
  fixedHeightText: {
    height: 517,
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
