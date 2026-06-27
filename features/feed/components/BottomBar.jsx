import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, palette } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';
import Profile from '../../../shared/components/Profile';
import ButtonText from '../../../shared/components/ButtonText';
import ButtonIcon from '../../../shared/components/ButtonIcon';
import BookmarkStroke from '../../../assets/icons/ic_bookmark_stroke.svg';
import BookmarkFill from '../../../assets/icons/ic_bookmark_fill.svg';
import HeartStroke from '../../../assets/icons/ic_heart_stroke.svg';
import HeartFill from '../../../assets/icons/ic_heart_fill.svg';

export default function BottomBar({
  name = '수신인 선택',
  id,
  profileSource,
  isFollowing = false,
  isBookmarked = false,
  isLiked = false,
  onPressFollow,
  onPressBookmark,
  onPressLike,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: padding.M + insets.bottom }]}>
      {/* 프로필 + 팔로우 */}
      <View style={styles.left}>
        <Profile name={name} id={id} imageSource={profileSource} type="id" />
        <ButtonText
          label={isFollowing ? '팔로잉' : '팔로우'}
          type={isFollowing ? 'neutral' : 'brand'}
          onPress={() => {
            if (!isFollowing) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPressFollow?.();
          }}
        />
      </View>

      {/* 북마크 + 좋아요 */}
      <View style={styles.actions}>
        <ButtonIcon
          Icon={isBookmarked ? BookmarkFill : BookmarkStroke}
          size="L"
          variant="none"
          iconColor={isBookmarked ? colors.fgBrand : palette.gray[30]}
          onPress={() => {
            onPressBookmark?.();
          }}
        />
        <ButtonIcon
          Icon={isLiked ? HeartFill : HeartStroke}
          size="L"
          variant="none"
          iconColor={isLiked ? palette.pink[50] : palette.gray[30]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPressLike?.();
          }}
        />
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
    paddingVertical: padding.M,
    backgroundColor: colors.bgLayerDefault,
    borderTopWidth: 1,
    borderTopColor: colors.strokeNeutralWeak,
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
