import { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
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

const NAV_ITEMS = [
  { type: 'icon', Icon: IcHome, isActive: true },
  { type: 'icon', Icon: IcLetter, isActive: false },
  { type: 'profile', profileSource: PROFILE_SOURCE, isActive: false },
];

export default function FeedHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const {
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toastVisible,
    fetchFeed,
    onTabPress,
    toggleBookmark,
    toggleLike,
    undoLastBookmark,
  } = useFeedHome();

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

  useEffect(() => {
    fetchFeed();
  }, []);

  const renderItem = ({ item, index }) => (
    <View onLayout={({ nativeEvent }) => {
      itemHeightsRef.current[index] = nativeEvent.layout.height;
      recomputeOffsets();
    }}>
    <Post
      type={item.files?.length > 0 ? 'img' : 'auto'}
      currentView={index === currentIndex}
      musicTitle={item.music?.title}
      musicArtist={item.music?.artist}
      musicCover={item.music?.coverUrl ? { uri: item.music.coverUrl } : undefined}
      content={item.record?.text ?? ''}
      images={item.files?.filter(f => f.mimeType?.startsWith('image/')).map(f => ({ uri: f.url })) ?? []}
      name={item.user?.nickname ?? ''}
      id={item.user?.loginId}
      date={item.record?.date ?? ''}
      isBookmarked={item.isBookmarked ?? false}
      isLiked={item.isLiked ?? false}
      onPressBookmark={() => toggleBookmark(item.feedId)}
      onPressLike={() => toggleLike(item.feedId)}
      onPressBody={() => {
        if (index !== currentIndex) {
          flatListRef.current?.scrollToOffset({ offset: snapOffsets[index] ?? 0, animated: true });
        } else {
          navigation.navigate('FeedDetail', { feedId: item.feedId });
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
          onPressFeed={() => navigation.navigate('Record')}
          onPressLetter={() => navigation.navigate('SelectRecipientScreen')}
        />
      </View>

      <Toast
        style={[styles.toast, { bottom: insets.bottom + 44 + padding.XXL }]}
        message="기록을 북마크에 추가했습니다."
        type="success"
        actionLabel="이동하기"
        onPressAction={undoLastBookmark}
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
