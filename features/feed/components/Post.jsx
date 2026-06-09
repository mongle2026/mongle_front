import { useState, useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Img from '../../write/components/Img';

import Music from '../../../shared/components/Music';
import Profile from '../../../shared/components/Profile';
import ButtonIcon from '../../../shared/components/ButtonIcon';
import BookmarkStroke from '../../../assets/icons/ic_bookmark_stroke.svg';
import BookmarkFill from '../../../assets/icons/ic_bookmark_fill.svg';
import HeartStroke from '../../../assets/icons/ic_heart_stroke.svg';
import HeartFill from '../../../assets/icons/ic_heart_fill.svg';
import { colors, palette } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

const MAX_LINES = { textOnly: 12, img: 6, textShort: 6 };

// 줄마다 underline + 마지막 줄에 "더보기" 절대 위치
function TextLines({ content, maxLines, expanded, onExpand, fixed }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  const onTextLayout = useCallback((e) => {
    if (!measured) {
      setLines(e.nativeEvent.lines);
      setMeasured(true);
    }
  }, [measured]);

  const hasMore = !expanded && lines.length > maxLines;
  const sliced = expanded ? lines : lines.slice(0, maxLines);

  // fixed=true면 maxLines만큼 빈 줄 패딩
  const visibleLines = fixed && !expanded
    ? [...sliced, ...Array(Math.max(0, maxLines - sliced.length)).fill({ text: '' })]
    : sliced;

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
              <Pressable style={styles.moreButton} onPress={onExpand}>
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
  type = 'textOnly',
  currentView = true,
  musicTitle,
  musicArtist,
  musicCover,
  content = '',
  images = [],
  name = '수신인 선택',
  date = '',
  profileSource,
  isBookmarked = false,
  isLiked = false,
  onPressBookmark,
  onPressLike,
  onPressMusic,
  onPressBody,
}) {
  const [expanded, setExpanded] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimerRef = useRef(null);
  const showImages = (type === 'img' || type === 'textShort') && images.length > 0;

  const handleBodyPress = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      clearTimeout(tapTimerRef.current);
      lastTapRef.current = 0;
      onPressLike?.();
    } else {
      lastTapRef.current = now;
      tapTimerRef.current = setTimeout(() => {
        onPressBody?.();
      }, DOUBLE_TAP_DELAY);
    }
  }, [onPressLike, onPressBody]);

  return (
    <View style={[styles.container, !currentView && styles.dimmed]}>

      {/* 음악 */}
      <View style={styles.musicWrapper}>
        <Music
          title={musicTitle}
          artist={musicArtist}
          imageSource={musicCover}
          button
          onPressButton={onPressMusic}
        />
      </View>

      {/* 텍스트 + 이미지 */}
      <Pressable style={styles.body} onPress={handleBodyPress}>
        <TextLines
          content={content}
          maxLines={MAX_LINES[type]}
          expanded={expanded}
          onExpand={() => setExpanded(true)}
          fixed={type === 'textOnly'}
        />

        {showImages && (
          <View style={styles.imageRow}>
            {images.slice(0, 2).map((src, i) => (
              <Img
                key={i}
                variant="ImgOnly"
                imageSource={typeof src === 'string' ? { uri: src } : src}
              />
            ))}
          </View>
        )}
      </Pressable>

      {/* 푸터 */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Profile name={name} imageSource={profileSource} tailText="" />
          <Text style={styles.date}>{date}</Text>
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
    paddingVertical: padding.M,
    gap: gap.M,
    borderRadius: radius.M,
  },
  dimmed: {
    opacity: 0.1,
  },
  musicWrapper: {
    alignSelf: 'stretch',
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
  },
  body: {
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
    ...typo.bodySmall,
    color: colors.fgLayerNeutral,
  },
  underline: {
    height: 1,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: colors.strokeNeutralWeak,
  },
  moreButton: {
    position: 'absolute',
    right: 0,
    bottom: gap.XS + 1, // underline 위
    backgroundColor: colors.bgLayerDefault,
    paddingLeft: gap.S,
  },
  moreText: {
    fontFamily: 'Pretendard-Regular',
    ...typo.bodySmall,
    color: colors.fgPlaceholder,
  },

  // Images
  imageRow: {
    flexDirection: 'row',
    gap: gap.S,
    paddingVertical: padding.S,
  },

  // Footer
  footer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  date: {
    ...typo.captionSmall,
    color: colors.fgLayerNeutralWeak,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
