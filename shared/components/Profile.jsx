import { Image, Text, View, StyleSheet, Pressable } from 'react-native';

import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

const DEFAULT_PROFILE_IMAGE = require('../../assets/write/profile_img.png');

export default function Profile({
  name = 'nickname',
  tailText,
  imageSource,
  imageOnly = false,
  type = 'Profile',
  onPress,
  style,
}) {
  const isEmpty = type === 'empty';
  const currentImageSource = imageSource || DEFAULT_PROFILE_IMAGE;

  return (
    <Pressable style={[styles.container, style]} onPress={onPress} disabled={!onPress}>
      {!isEmpty && (
        <Image
          source={currentImageSource}
          style={styles.profileImage}
          resizeMode="cover"
        />
      )}

      {!imageOnly && (
        isEmpty ? (
          <View style={styles.emptyChip}>
            <Text style={styles.name} numberOfLines={1}>수신인 선택</Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            {tailText && (
              <Text style={styles.tailText} numberOfLines={1}>{tailText}</Text>
            )}
          </View>
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
    gap: gap.M,
    borderRadius: radius.XS,
  },
  emptyChip: {
    backgroundColor: colors.bgLayerWeak,
    borderRadius: radius.M,
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: radius.XS,
  },
  emptyProfileImage: {
    width: 34,
    height: 34,
    borderRadius: radius.XS,
    backgroundColor: colors.bgLayerWeak,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.XS,
  },
  name: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    textAlign: 'left',
  },
  tailText: {
    ...typo.bodyMedium,
    color: colors.fgLayerNeutral,
    textAlign: 'left',
  },
});