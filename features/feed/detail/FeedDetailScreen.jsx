import { useCallback, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import MusicPlay from '../../../shared/components/MusicPlay';
import Carousel from '../../../shared/components/Carousel';
import Caption from '../components/Caption';
import BottomBar from '../components/BottomBar';

import { colors } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { gap, padding } from '../../../shared/styles/token';

function TextLines({ content = '', expanded, onExpand }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  const MAX_LINES = 7;

  const onTextLayout = useCallback((e) => {
    if (!measured) {
      setLines(e.nativeEvent.lines);
      setMeasured(true);
    }
  }, [measured]);

  const hasMore = !expanded && lines.length > MAX_LINES;
  const visibleLines = expanded ? lines : lines.slice(0, MAX_LINES);

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

export default function FeedDetailScreen({ navigation, route, ...directProps }) {
  const {
    musicTitle,
    musicArtist,
    musicCover,
    audioUri,
    content = '',
    images = [],
    name = '',
    id,
    profileSource,
    isFollowing: initFollowing = false,
    isBookmarked: initBookmarked = false,
    isLiked: initLiked = false,
    date = '',
    bookmarkCount = 0,
    onPressFollow,
    onPressBookmark,
    onPressLike,
  } = { ...directProps, ...(route?.params ?? {}) };

  const [isFollowing, setFollowing] = useState(initFollowing);
  const [isBookmarked, setBookmarked] = useState(initBookmarked);
  const [isLiked, setLiked] = useState(initLiked);
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="기록"
        showTextButton={false}
        onPressBack={() => navigation?.goBack()}
        theme="light"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MusicPlay
          title={musicTitle}
          artist={musicArtist}
          imageSource={musicCover}
          audioUri={audioUri}
        />

        <View style={styles.textSection}>
          <TextLines
            content={content}
            expanded={expanded}
            onExpand={() => setExpanded(true)}
          />
        </View>

        <Carousel images={images} onPressImage={setSelectedImage} />

        <Caption date={date} bookmarkCount={bookmarkCount} />
      </ScrollView>

      <Modal visible={!!selectedImage} transparent animationType="fade" statusBarTranslucent>
        <Pressable style={styles.modalDim} onPress={() => setSelectedImage(null)}>
          <View style={styles.modalImageWrapper}>
            {selectedImage && (
              <Image
                source={typeof selectedImage === 'string' ? { uri: selectedImage } : selectedImage}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>

      <BottomBar
        name={name}
        id={id}
        profileSource={profileSource}
        isFollowing={isFollowing}
        isBookmarked={isBookmarked}
        isLiked={isLiked}
        onPressFollow={() => { setFollowing(f => !f); onPressFollow?.(); }}
        onPressBookmark={() => { setBookmarked(b => !b); onPressBookmark?.(); }}
        onPressLike={() => { setLiked(l => !l); onPressLike?.(); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgLayerDefault,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: padding.XL,
  },
  textSection: {
    paddingHorizontal: padding.L,
    paddingVertical: padding.M,
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
  modalDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageWrapper: {
    width: Dimensions.get('window').width - padding.XL * 2,
    aspectRatio: 1,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
