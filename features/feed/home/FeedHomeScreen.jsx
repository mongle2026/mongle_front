import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../../shared/styles/color';
import { gap, padding } from '../../../shared/styles/token';
import TopNavigation from '../components/TopNavigation';
import Post from '../components/Post';
import BottomNavigation from '../../../shared/components/BottomNavigation';
import FAB from '../../../shared/components/FAB';
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
  const {
    activeTab,
    posts,
    currentIndex,
    fetchFeed,
    onTabPress,
    toggleBookmark,
    toggleLike,
  } = useFeedHome();

  useEffect(() => {
    fetchFeed();
  }, []);

  const renderItem = ({ item, index }) => (
    <Post
      type={item.files?.length > 0 ? 'img' : 'textOnly'}
      currentView={index === currentIndex}
      musicTitle={item.music?.title}
      musicArtist={item.music?.artist}
      musicCover={item.music?.coverUrl ? { uri: item.music.coverUrl } : undefined}
      content={item.record?.text ?? ''}
      images={item.files?.filter(f => f.mimeType?.startsWith('image/')).map(f => ({ uri: f.url })) ?? []}
      name={item.user?.nickname ?? ''}
      date={item.record?.date ?? ''}
      isBookmarked={item.isBookmarked ?? false}
      isLiked={item.isLiked ?? false}
      onPressBookmark={() => toggleBookmark(item.feedId)}
      onPressLike={() => toggleLike(item.feedId)}
      onPressBody={() => navigation.navigate('FeedDetail', { feedId: item.feedId })}
    />
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={posts}
        keyExtractor={item => String(item.feedId)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + 58 + padding.M, paddingBottom: insets.bottom + 44 + padding.XXL },
        ]}
        showsVerticalScrollIndicator={false}
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
