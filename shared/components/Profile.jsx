import { Image, Text, View, StyleSheet } from 'react-native';

import { colors } from '../styles/color';
import { padding, gap } from '../styles/token';
import { typo } from '../styles/typo';

const DEFAULT_PROFILE_IMAGE = require('../../assets/write/profile_img.png');

export default function Profile({
  name = 'nickname',
  tailText = '에게',
  imageSource,
  style,
}) {
  const currentImageSource = imageSource || DEFAULT_PROFILE_IMAGE;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={currentImageSource}
        style={styles.profileImage}
        resizeMode="cover"
      />

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.tailText} numberOfLines={1}>
          {tailText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
    gap: gap.M,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
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