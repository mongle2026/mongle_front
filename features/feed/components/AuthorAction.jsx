import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';
import Profile from '../../../shared/components/Profile';
import ButtonText from '../../../shared/components/ButtonText';
import LikeButton from '../home/hook/LikeButton';
import BookmarkButton from '../home/hook/BookmarkButton';

export default function AuthorAction({
  name = '수신인 선택',
  id,
  profileSource,
  isFollowing = false,
  isBookmarked = false,
  isLiked = false,
  onPressFollow,
  onPressBookmark,
  onPressLike,
  likeRef,
}) {
  return (
    <View style={styles.container}>
      {/* 프로필 + 팔로우 */}
      <View style={styles.left}>
        <Profile name={name} id={id} imageSource={profileSource} type="id" />
        <ButtonText
          label={isFollowing ? '팔로잉' : '팔로우'}
          type={isFollowing ? 'neutral' : 'brand'}
          onPress={() => {
            if (!isFollowing)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPressFollow?.();
          }}
        />
      </View>

      {/* 북마크 + 좋아요 */}
      <View style={styles.actions}>
        <BookmarkButton isBookmarked={isBookmarked} onPress={onPressBookmark} />
        <LikeButton ref={likeRef} isLiked={isLiked} onPress={onPressLike} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgLayerDefault,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
