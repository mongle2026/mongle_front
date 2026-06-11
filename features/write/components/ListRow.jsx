import { useRef } from 'react';
import { Animated, Image, Pressable, Text, View, StyleSheet } from 'react-native';

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
  selectedColor = colors.bgLayerSurface,
  onPress,
  style,
}) {
  const hasCaption = caption && subtitle;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.row,
            (selected || pressed) ? { backgroundColor: selectedColor } : styles.default,
            pressed && { borderRadius: radius.M },
          ]}
        >
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
        </Pressable>
      </Animated.View>
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
  },
  default: {
    backgroundColor: colors.bgLayerWeak,
  },
  selected: {
    backgroundColor: colors.bgLayerSurface,
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
