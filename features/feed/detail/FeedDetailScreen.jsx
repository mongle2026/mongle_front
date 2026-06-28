import React, { useCallback, useState, useEffect } from 'react';
import { formatDateDetail } from '../../../shared/utils/formatDate';
import useFeedActions from '../home/hook/useFeedActions';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import TopNavigation from '../../../shared/components/TopNavigation';
import KebabIcon from '../../../assets/icons/ic_kebab.svg';
import MusicPlay from '../../../shared/components/MusicPlay';
import Carousel from '../../../shared/components/Carousel';
import Caption from '../components/Caption';
import BottomBar from '../components/BottomBar';

import { colors } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { gap, padding } from '../../../shared/styles/token';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

function TextLines({ content = '' }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

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

  const {
    data: feed,
  } = useQuery({
    queryKey: ['feed', String(feedId), userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/feed/${feedId}`, {
        params: { userId },
      });

      return response.data;
    },
  });

  const {
    toggleLike,
    toggleBookmark,
  } = useFeedActions({ userId });

  if (!feed) {
    return null;
  }

  const user = feed.user;
  const record = feed.record;
  const music = feed.music;
  const files = feed.files;
  const images = feed.files?.filter(f => f.mimeType?.startsWith('image/')).map(f => ({ uri: `${API_BASE_URL}${f.url}` })) ?? [];

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="기록"
        showTextButton={false}
        onPressBack={() => navigation?.goBack()}
        rightIcon={KebabIcon}
        rightIconColor={colors.fgNeutralWeak}
        theme="light"
      />

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
          <View style={styles.textSection}>
            <TextLines content={record?.text} />
          </View>
        )}

        <Carousel images={images} onPressImage={setSelectedImage} />

        <Caption date={record.date ? formatDateDetail(record.date) : ''} bookmarkCount={feed.bookmarkCount} />
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
        name={user.nickname}
        id={user.userCode}
        profileSource={
          user.hasProfileImage && user.profileImageUrl
            ? { uri: `${API_BASE_URL}${user.profileImageUrl}` }
            : null
        }
        isFollowing={isFollowing}
        isBookmarked={feed.isBookmarked}
        isLiked={feed.isLiked}
        onPressFollow={() => {
          setFollowing(f => !f);
          onPressFollow?.();
        }}
        onPressBookmark={() => toggleBookmark(feed)}
        onPressLike={() => toggleLike(feed)}
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
