import { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../../shared/styles/color';
import { gap, padding } from '../../../shared/styles/token';
import TopNavigation from '../components/TopNavigation';
import Post from '../components/Post';
import BottomNavigation from '../../../shared/components/BottomNavigation';
import FAB from '../../../shared/components/FAB';
import Toast from '../../../shared/components/Toast';
import IcHome from '../../../assets/icons/ic_home.svg';
import IcLetter from '../../../assets/icons/ic_letter.svg';

import useFeedHome from './hook/useFeedHome';
import useFeedActions from './hook/useFeedActions';
import { useRecordFormStore } from '../../write/record/store/useRecordFormStore';

const PROFILE_SOURCE = require('../../../assets/write/profile_img.png');

const NAV_ITEMS = [
  { type: 'icon', Icon: IcHome, isActive: true },
  { type: 'icon', Icon: IcLetter, isActive: false },
  { type: 'profile', profileSource: PROFILE_SOURCE, isActive: false },
];
// const API_BASE_URL = 'http://192.168.0.3:3000';
const API_BASE_URL = 'http://192.168.0.35:3000';


export default function FeedHomeScreen({ navigation, route }) {
  const userId = 1;
  const insets = useSafeAreaInsets();
  const setRecordType = useRecordFormStore(state => state.setRecordType);
  const { height: screenHeight } = useWindowDimensions();

  const player = useAudioPlayer(null);
  const [playingFeedId, setPlayingFeedId] = useState(null);

  const {
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toastVisible,
    refetchFeed,
    onTabPress,
    showToast,
  } = useFeedHome();

  const {
    toggleLike,
    toggleBookmark,
    bookmarkMutation,
  } = useFeedActions({
    userId,
    onBookmarkAdded: showToast,
  });

  const [snapOffsets, setSnapOffsets] = useState([]);
  const itemHeightsRef = useRef({});
  const flatListRef = useRef(null);

  const recomputeOffsets = useCallback(() => {
    const paddingTop = insets.top + 58 + padding.M;
    const count = posts.length;
    const offsets = [];
    let cumulative = paddingTop;
    for (let i = 0; i < count; i++) {
      const h = itemHeightsRef.current[i] ?? 0;
      offsets.push(Math.max(0, cumulative - (screenHeight - h) / 2));
      cumulative += h + padding.XL;
    }
    setSnapOffsets(offsets);
  }, [posts.length, insets.top, screenHeight]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  useFocusEffect(
    useCallback(() => {
      refetchFeed();
    }, [refetchFeed])
  );

  const onPressFeed = () => {
    setRecordType('FEED');
    navigation.navigate('Record');
  };

  const onPressLetter = () => {
    setRecordType('LETTER');
    navigation.navigate('Record');
  };

  const safePause = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      console.log('audio pause ignored:', error?.message);
    }

    setPlayingFeedId(null);
  }, [player]);

  const onPressMusic = useCallback((item) => {
    const previewUrl = item.music?.previewUrl;

    if (!previewUrl) {
      return;
    }

    // 같은 노래 버튼을 다시 누르면 정지
    if (playingFeedId === item.feedId) {
      safePause();
      return;
    }

    // 다른 노래를 누르면 기존 소스를 교체하고 처음부터 재생
    player.replace(previewUrl);
    player.seekTo(0);
    player.play();

    setPlayingFeedId(item.feedId);
  }, [player, playingFeedId]);

  useEffect(() => {
    if (playingFeedId === null) {
      return;
    }

    const currentFeedId = posts[currentIndex]?.feedId;

    if (currentFeedId && currentFeedId !== playingFeedId) {
      safePause();
    }
  }, [currentIndex, posts, playingFeedId, player]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      safePause();
    });

    return unsubscribe;
  }, [navigation, safePause]);

  const renderItem = ({ item, index }) => (
    <View onLayout={({ nativeEvent }) => {
      itemHeightsRef.current[index] = nativeEvent.layout.height;
      recomputeOffsets();
    }}>
      <Post
        type={item.files?.length > 0 ? 'img' : 'textFull'}
        currentView={index === currentIndex}
        musicTitle={item.music?.musicTitle}
        musicArtist={item.music?.musicArtist}
        musicCover={item.music?.musicArtwork ? item.music.musicArtwork : undefined}
        content={item.record?.text ?? ''}
        images={item.files?.filter(f => f.mimeType?.startsWith('image/')).map(f => ({ uri: `${API_BASE_URL}${f.url}` })) ?? []}
        name={item.user?.nickname ?? ''}
        date={item.record?.date ?? ''}
        id={item.user?.userCode}
        profileSource={item.user.hasProfileImage && item.user.profileImageUrl ? { uri: `${API_BASE_URL}${item.user.profileImageUrl}` } : null}
        isBookmarked={item.isBookmarked ?? false}
        isLiked={item.isLiked ?? false}
        onPressBookmark={() => toggleBookmark(item)}
        onPressLike={() => toggleLike(item)}
        onPressMusic={() => onPressMusic(item)}
        onPressBody={() => {
          if (index !== currentIndex) {
            flatListRef.current?.scrollToOffset({
              offset: snapOffsets[index] ?? 0,
              animated: true,
            });
          } else {
            navigation.navigate('FeedDetail', {
              feedId: item.feedId,
            });
          }
        }}
      />
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={item => String(item.feedId)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + 58 + padding.M, paddingBottom: insets.bottom + 44 + padding.XXL },
        ]}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToOffsets={snapOffsets}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <TopNavigation
        style={styles.topNav}
        activeTab={activeTab}
        onTabPress={onTabPress}
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + padding.XXL }]}>
        <BottomNavigation items={NAV_ITEMS} />
        <FAB
          onPressFeed={onPressFeed}
          onPressLetter={onPressLetter}
        />
      </View>

      <Toast
        style={[styles.toast, { bottom: insets.bottom + 44 + padding.XXL }]}
        message="기록을 북마크에 추가했습니다."
        type="success"
        actionLabel="이동하기"
        // onPressAction={undoLastBookmark}
        visible={toastVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgDefault,
  },
  list: {
    paddingHorizontal: padding.M,
    gap: padding.XL,
  },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: gap.XL,
    paddingTop: padding.M,
  },
});
