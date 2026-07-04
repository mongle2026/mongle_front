import React, { useCallback, useRef, useState, useEffect } from 'react';
import { formatDateDetail } from '../../../shared/utils/formatDate';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native';
import axios from 'axios';

import TopNavigation from '../../../shared/components/TopNavigation';
import KebabIcon from '../../../assets/icons/ic_kebab.svg';
import MusicPlay from '../../../shared/components/music/MusicPlay';
import Carousel from '../../../shared/components/Carousel';
import Caption from '../components/Caption';
import BottomBar from '../components/BottomBar';
import Menu from '../../../shared/components/Menu';
import Dialog from '../../../shared/components/Dialog';

import { colors } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { gap, padding } from '../../../shared/styles/token';

import useFeedDetail from './hook/useFeedDetail';
import useFeedActions from '../home/hook/useFeedActions';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const DOUBLE_TAP_DELAY = 300;

function TextLines({ content = '' }) {
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

  if (!measured) {
    return (
      <Text style={[styles.lineText, { opacity: 0 }]} onTextLayout={onTextLayout}>
        {content}
      </Text>
    );
  }

  return (
    <View style={styles.linesContainer}>
      {lines.map((line, i) => (
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

export default function FeedDetailScreen({ navigation, route, ...directProps }) {
  const {
    onPressFollow,
  } = { ...directProps, ...(route?.params ?? {}) };
  // 하드코딩
  const userId = 1;
  const { feedId } = route.params;

  const [isFollowing, setFollowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const { feedData: initialFeedData } = route?.params ?? {};

  const {
    feed,
    deleteFeed,
    isDeletingFeed,
  } = useFeedDetail({
    feedId,
    userId,
    initialFeedData,
    onDeleteSuccess: () => {
      setDialogVisible(false);
      navigation.goBack();
    },
  });

  const {
    toggleLike,
    toggleBookmark,
  } = useFeedActions({ userId });

  const handleCloseDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const handleDeleteFeed = () => {
    if (isDeletingFeed) {
      return;
    }

    deleteFeed();
  };

  const [localFeed, setLocalFeed] = useState(feed);
  useEffect(() => { setLocalFeed(feed); }, [feed]);

  // 본문 더블탭 → 하트 바운스 + 좋아요 토글 (취소 포함)
  const likeRef = useRef(null);
  const lastTapRef = useRef(0);

  const handleContentTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      lastTapRef.current = 0;
      likeRef.current?.bounce();
      toggleLike(localFeed);
    } else {
      lastTapRef.current = now;
    }
  }, [toggleLike, localFeed]);

  useEffect(() => {
    if (!dialogVisible) {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleCloseDialog();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [dialogVisible, handleCloseDialog]);


  if (!localFeed) {
    return null;
  }

  const user = localFeed.user;
  const record = localFeed.record;
  const music = localFeed.music;
  const images = localFeed.files?.filter(f => f.mimeType?.startsWith('image/')).map(f => ({ uri: `${API_BASE_URL}${f.url}` })) ?? [];

  return (
    <View style={styles.screen}>

      {menuVisible && (
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuVisible(false)}
        />
      )}

      <View style={styles.topArea}>
        <TopNavigation
          title="기록"
          showTextButton={false}
          onPressBack={() => navigation?.goBack()}
          rightIcon={KebabIcon}
          rightIconColor={colors.fgNeutralWeak}
          onPressRightIcon={() => setMenuVisible(prev => !prev)}
          theme="light"
        />

        {menuVisible && (
          <View style={styles.menuWrapper}>
            <Menu
              onEdit={() => {
                setMenuVisible(false);
                navigation.navigate('RecordEdit', {
                  feedId: localFeed.feedId,
                });
              }}
              onDelete={() => {
                setMenuVisible(false);
                setDialogVisible(true);
              }}
            />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MusicPlay
          title={music?.musicTitle}
          artist={music?.musicArtist}
          imageSource={music?.musicArtwork ? music?.musicArtwork : undefined}
          audioUri={music?.previewUrl}
        />

        {!!record?.text && (
          <Pressable style={styles.textSection} onPress={handleContentTap}>
            <TextLines content={record?.text} />
          </Pressable>
        )}

        <Carousel images={images} onPressImage={setSelectedImage} />

        <Caption
          date={localFeed.createdAt ? formatDateDetail(localFeed.createdAt) : ''}
          bookmarkCount={localFeed.bookmarkCount}
        />
      </ScrollView>

      <Modal visible={!!selectedImage} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setSelectedImage(null)}>
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
        likeRef={likeRef}
        name={user.nickname}
        id={user.userCode}
        profileSource={
          user.hasProfileImage && user.profileImageUrl
            ? { uri: `${API_BASE_URL}${user.profileImageUrl}` }
            : null
        }
        isFollowing={isFollowing}
        isBookmarked={localFeed.isBookmarked}
        isLiked={localFeed.isLiked}
        onPressFollow={() => {
          setFollowing(f => !f);
          onPressFollow?.();
        }}
        onPressBookmark={() => toggleBookmark(localFeed)}
        onPressLike={() => toggleLike(localFeed)}
      />

      {dialogVisible && (
        <View style={styles.dim}>
          <Dialog
            title='글을 영구 삭제할까요?'
            description='삭제한 글은 다시 되돌릴 수 없습니다.'
            cancelLabel='취소'
            confirmLabel='삭제'
            onCancel={handleCloseDialog}
            onConfirm={handleDeleteFeed}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgLayerDefault,
  },
  topArea: {
    zIndex: 20,
    elevation: 20,
  },
  menuWrapper: {
    position: 'absolute',
    top: '100%',
    right: 18,
    zIndex: 30,
    elevation: 30,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
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
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
});
