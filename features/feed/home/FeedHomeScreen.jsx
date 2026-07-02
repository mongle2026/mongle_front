import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
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

const PROFILE_SOURCE = require('../../../assets/write/profile_img.png');

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function FeedHomeScreen({ navigation, route }) {
  const NAV_ITEMS = [
    { type: 'icon', Icon: IcHome, isActive: true },
    { type: 'icon', Icon: IcLetter, isActive: false, onPress: () => navigation.navigate('Main', { screen: 'Letter' }) },
    { type: 'profile', profileSource: PROFILE_SOURCE, isActive: false },
  ];

  const userId = 1;
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const [activeMusicFeedId, setActiveMusicFeedId] = useState(null);
  const ignoreNextBlurRef = useRef(false);

  const {
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toastVisible,
    refetchFeed,
    onTabPress,
    toggleLike,
    toggleBookmark,
  } = useFeedHome();

  const [snapOffsets, setSnapOffsets] = useState([]);
  const itemHeightsRef = useRef({});
  const flatListRef = useRef(null);

  const NAV_ITEMS = useMemo(() => [
    { type: 'icon', Icon: IcHome, isActive: true },
    { type: 'icon', Icon: IcLetter, isActive: false, onPress: () => navigation.navigate('Main', { screen: 'Letter' }) },
    { type: 'profile', profileSource: PROFILE_SOURCE, isActive: false },
  ], [navigation]);

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

  const onPressFab = useCallback((fabPos) => {
    ignoreNextBlurRef.current = true;

    navigation.navigate('FabMenuModal', {
      fabPos,
    });
  };

  useEffect(() => {
    if (activeMusicFeedId === null) return;
    const currentFeedId = posts[currentIndex]?.feedId;
    if (currentFeedId && currentFeedId !== activeMusicFeedId) {
      setActiveMusicFeedId(null);
    }
  }, [currentIndex, posts, activeMusicFeedId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (ignoreNextBlurRef.current) {
        ignoreNextBlurRef.current = false;
        return;
      }
      setActiveMusicFeedId(null);
    });
    return unsubscribe;
  }, [navigation]);

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
        musicAudioUri={item.music?.previewUrl}
        musicId={item.feedId}
        activeMusicId={activeMusicFeedId}
        onChangeActiveMusic={setActiveMusicFeedId}
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
    <Animated.View style={styles.screen} entering={FadeIn.duration(400)}>
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
        <FAB onPress={onPressFab} />
      </View>

      <Toast
        style={[styles.toast, { bottom: insets.bottom + 44 + padding.XXL }]}
        message="기록을 북마크에 추가했습니다."
        type="success"
        actionLabel="이동하기"
        visible={toastVisible}
      />
    </Animated.View>
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
