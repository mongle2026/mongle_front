import { Image, Text, View, StyleSheet } from 'react-native';

import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

const DEFAULT_COVER_IMAGE = require('../../src/write/assets/cover_img.png');

export default function Music({
  title = '노래 제목',
  artist = '가수명',
  imageSource,
  style,
}) {
  const currentImageSource = imageSource || DEFAULT_COVER_IMAGE;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <Image
          source={currentImageSource}
          style={styles.cover}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.artist} numberOfLines={1}>
            {artist}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
  },
  container: {
    width: '100%',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.M,
    gap: gap.L,
    borderRadius: radius.M,
    backgroundColor: colors.bgNeutralWeak,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: radius.XS,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: gap.XS,
  },
  title: {
    ...typo.titleXSmall,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  artist: {
    ...typo.captionSmall,
    color: colors.fgLayerNeutralWeak,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
});