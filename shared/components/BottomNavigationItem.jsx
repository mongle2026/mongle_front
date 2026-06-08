import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors, palette } from '../styles/color';

const PILL_WIDTH = 80;
const PILL_HEIGHT = 44;
const ICON_SIZE = 18;
const PROFILE_SIZE = 28;

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
              color={isActive ? colors.fgNeutral : colors.fgLayerNeutralWeak}
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
    width: 24,
    height: 24,
    borderRadius: 100,
  },
  profileInactive: {
    opacity: 0.5,
  },
});
