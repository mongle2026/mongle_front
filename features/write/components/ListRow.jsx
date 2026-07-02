import { useRef, useEffect } from 'react';
import { Image, Pressable, Text, View, StyleSheet, Animated } from 'react-native';

import { colors } from '../../../shared/styles/color';
import { padding, gap, radius } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

export default function ListRow({
  title = 'title',
  subtitle,
  imageSource,
  img = 'profile',
  caption = false,
  selected = false,
  onPress,
  style,
}) {
  const hasCaption = caption && subtitle;
  const bgAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  const animateTo = (toValue) => {
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

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(1)}
        onPressOut={() => !selected && animateTo(0)}
      >
        <Animated.View style={[styles.row, { backgroundColor }]}>
          <Image
            source={{ uri: imageSource }}
            style={[
              styles.image,
              img === 'profile' ? styles.profileImage : styles.musicImage,
            ]}
            resizeMode="cover"
          />

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>

            {hasCaption && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
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
    paddingHorizontal: padding.L,
    paddingVertical: padding.L,
    gap: gap.M,
    overflow: 'hidden',
    borderRadius: radius.M,
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: colors.bgLayerWeak,
  },
  profileImage: {
    borderRadius: 20,
  },
  musicImage: {
    borderRadius: radius.XS,
  },
  textContainer: {
    flex: 1,
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
});
