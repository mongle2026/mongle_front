import { Image, Pressable, Text, View, StyleSheet } from 'react-native';

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

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={onPress}
        style={[
          styles.row,
          selected ? styles.selected : styles.default,
        ]}
      >
        <Image
          source={imageSource}
          style={[
            styles.image,
            img === 'profile' ? styles.profileImage : styles.musicImage,
          ]}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {title}
          </Text>

          {hasCaption && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
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
    paddingVertical: padding.M,
    gap: gap.M,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.bgLayerDefault,
  },
  selected: {
    backgroundColor: colors.bgNeutralWeak,
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: colors.bgNeutralWeak,
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

  // 큰 글씨(ex.이름, 노래 제목)
  title: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },

  // 작은 글씨(ex.id, 가수명)
  subtitle: {
    ...typo.captionSmall,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
});