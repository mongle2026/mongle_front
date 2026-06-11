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
import { formatDate } from '../../../shared/utils/formatDate';

const MAX_LINES = { textFull: 12, img: 6, textShort: 6 };
const AUTO_THRESHOLD = 12;

function TextLines({ content, maxLines, onTotalLines }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  const onTextLayout = useCallback((e) => {
    if (!measured) {
      const all = e.nativeEvent.lines;
      setLines(all);
      setMeasured(true);
      onTotalLines?.(all.length);
    }
  }, [measured]);

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
      {visibleLines.map((line, i) => (
        <View key={i} style={styles.lineRow}>
          <Text style={styles.lineText} numberOfLines={1}>
            {line.text.trimEnd()}
          </Text>
          <View style={styles.underline} />
        </View>
      ))}
    </View>
  );
}

const DOUBLE_TAP_DELAY = 300;

export default function Post({
  type = 'auto',
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
  const [resolvedType, setResolvedType] = useState(type !== 'auto' ? type : null);
  const [imgShort, setImgShort] = useState(false);
  const effectiveType = type === 'auto' ? (resolvedType ?? 'textShort') : type;
  const isFixedHeight = effectiveType === 'textShort' || (effectiveType === 'img' && imgShort);

  const handleTotalLines = useCallback((count) => {
    if (type === 'auto') {
      setResolvedType(count >= AUTO_THRESHOLD ? 'textFull' : 'textShort');
    } else if (type === 'img') {
      setImgShort(count < MAX_LINES.img);
    }
  }, [type]);

  const lastTapRef = useRef(0);
  const tapTimerRef = useRef(null);
  const showImages = (effectiveType === 'img' || effectiveType === 'textShort') && images.length > 0;

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
    <View style={[styles.container, isFixedHeight && styles.fixedHeight, !currentView && styles.dimmed]}>
      {!currentView && (
        <Pressable style={styles.focusOverlay} onPress={onPressBody} />
      )}

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
          maxLines={MAX_LINES[effectiveType] ?? MAX_LINES.textShort}
          onTotalLines={handleTotalLines}
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
    paddingVertical: padding.M,
    gap: gap.M,
    borderRadius: radius.M,
    overflow: 'hidden',
  },
  fixedHeight: {
    height: 520,
  },
  focusOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
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
    color: colors.fgNeutralWeak,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
