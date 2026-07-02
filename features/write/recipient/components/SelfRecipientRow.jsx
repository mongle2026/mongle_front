import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../../../shared/styles/color';
import { padding, gap, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';

export default function SelfRecipientRow({
  title = 'name',
  imageSource,
  badgeLabel = '나에게',
  selected = false,
  onPress,
  style,
}) {
  const bgAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  const animateTo = toValue => {
    Animated.timing(bgAnim, {
      toValue,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateTo(selected ? 1 : 0);
  }, [selected]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bgLayerDefault, colors.bgLayerWeak],
  });

  const profileSource =
    typeof imageSource === 'string'
      ? { uri: imageSource }
      : imageSource;

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(1)}
        onPressOut={() => !selected && animateTo(0)}
      >
        <Animated.View style={[styles.row, { backgroundColor }]}>
          <View style={styles.leftContent}>
            {profileSource ? (
              <Image
                source={profileSource}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.profileImage, styles.profilePlaceholder]} />
            )}

            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>

          <View style={styles.selfBadge}>
            <Text style={styles.selfBadgeText}>{badgeLabel}</Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: padding.XL,
  },
  row: {
    width: '100%',
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.L,
    paddingVertical: padding.L,
    gap: gap.M,
    borderRadius: radius.M,
    overflow: 'hidden',
  },
  leftContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.M,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgLayerWeak,
  },
  profilePlaceholder: {
    backgroundColor: colors.bgLayerWeak,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
  },
  title: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  subtitle: {
    ...typo.captionSmall,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },

  selfBadge: {
    paddingVertical: padding.M,
    paddingHorizontal: padding.L,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.M,
    borderWidth: 1,
    borderColor: colors.strokeNeutralWeak,
  },
  selfBadgeText: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
  },
});