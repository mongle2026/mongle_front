import { Image, Text, View, StyleSheet, Pressable } from 'react-native';

import PlayFillIcon from '../../assets/icons/ic_play_fill.svg';
import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';
import ButtonIcon from './ButtonIcon';

const DEFAULT_COVER_IMAGE = require('../../assets/write/cover_img.png');

export default function Music({
  title,
  artist = '가수명',
  imageSource,
  button = false,
  empty = false,
  onPress,
  onPressButton,
  style,
}) {
  const currentImageSource = typeof imageSource === 'string'
    ? { uri: imageSource }
    : imageSource ?? DEFAULT_COVER_IMAGE;

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable style={styles.container} onPress={onPress} disabled={!onPress}>
        {!empty && (
          <Image
            source={currentImageSource}
            style={styles.cover}
            resizeMode="cover"
          />
        )}

        <View style={styles.textContainer}>
          <Text style={empty ? styles.titleEmpty : styles.title} numberOfLines={1}>
            {title ?? (empty ? '음악 선택' : '노래 제목')}
          </Text>

          {!empty && (
            <Text style={styles.artist} numberOfLines={1}>
              {artist}
            </Text>
          )}
        </View>

        {button && !empty && (
          <ButtonIcon
            Icon={PlayFillIcon}
            size="XL"
            variant="none"
            iconColor={colors.fgLayerNeutral}
            onPress={onPressButton}
          />
        )}
      </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.M,
    gap: gap.L,
    borderRadius: radius.M,
    backgroundColor: colors.bgLayerWeak,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: radius.XS,
  },
  coverEmpty: {
    width: 56,
    height: 56,
    borderRadius: radius.XS,
    backgroundColor: colors.bgLayerWeak,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    gap: gap.XS,
  },
  title: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  titleEmpty: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  artist: {
    ...typo.captionSmall,
    color: colors.fgPlaceholder,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
});