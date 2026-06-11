import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors, palette } from '../styles/color';

const PILL_HEIGHT = 44;
const ICON_SIZE = 24;
const PROFILE_SIZE = 24;

export default function BottomNavigationItem({
  type = 'icon',
  isActive = false,
  Icon,
  profileSource,
  onPress,
}) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={[styles.pill, isActive && styles.pillActive]}>
        {type === 'icon' ? (
          Icon && (
            <Icon
              width={ICON_SIZE}
              height={ICON_SIZE}
              color={isActive ? colors.fgNeutral : palette.whiteOpacity[30]}
            />
          )
        ) : (
          <Image
            source={profileSource}
            style={[styles.profile, !isActive && styles.profileInactive]}
            resizeMode="cover"
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    width: 64,
    height: 44,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.bgDefault,
  },
  profile: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: 100,
  },
  profileInactive: {
    opacity: 0.5,
  },
});
