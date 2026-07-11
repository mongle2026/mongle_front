import { memo, useCallback, useMemo } from 'react';

import Post from '../../components/Post';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL;

const FeedPostItem = memo(function FeedPostItem({
  item,
  isCurrent,
  isMusicActive,
  snapOffset,
  navigation,
  flatListRef,
  setActiveMusicFeedId,
  toggleBookmark,
  toggleLike,
}) {
  const images = useMemo(() => {
    if (!Array.isArray(item.files)) {
      return [];
    }

    return item.files.reduce((result, file) => {
      if (file.mimeType?.startsWith('image/')) {
        result.push({
          uri: `${API_BASE_URL}${file.url}`,
        });
      }

      return result;
    }, []);
  }, [item.files]);

  const handlePressBody = useCallback(() => {
    if (!isCurrent) {
      flatListRef.current?.scrollToOffset({
        offset: snapOffset,
        animated: true,
      });
      return;
    }

    navigation.navigate('FeedDetail', {
      feedId: item.feedId,
      feedData: item,
    });
  }, [
    isCurrent,
    snapOffset,
    navigation,
    item,
    flatListRef,
  ]);

  const handlePressBookmark = useCallback(() => {
    toggleBookmark(item);
  }, [toggleBookmark, item]);

  const handlePressLike = useCallback(() => {
    toggleLike(item);
  }, [toggleLike, item]);

  return (
    <Post
      type={images.length > 0 ? 'img' : 'textFull'}
      currentView={isCurrent}
      musicTitle={item.music?.musicTitle}
      musicArtist={item.music?.musicArtist}
      musicCover={item.music?.musicArtwork}
      musicAudioUri={item.music?.previewUrl}
      musicId={item.feedId}
      activeMusicId={
        isMusicActive ? item.feedId : null
      }
      onChangeActiveMusic={setActiveMusicFeedId}
      content={item.record?.text ?? ''}
      images={images}
      name={item.user?.nickname ?? ''}
      date={item.record?.date ?? ''}
      id={item.user?.userCode}
      profileSource={
        item.user?.hasProfileImage &&
          item.user?.profileImageUrl
          ? {
            uri:
              `${API_BASE_URL}` +
              item.user.profileImageUrl,
          }
          : null
      }
      isBookmarked={item.isBookmarked ?? false}
      isLiked={item.isLiked ?? false}
      onPressBookmark={handlePressBookmark}
      onPressLike={handlePressLike}
      onPressBody={handlePressBody}
    />
  );
});

export default FeedPostItem;