import { Image, Text, View, StyleSheet, Pressable } from 'react-native';

import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

const DEFAULT_PROFILE_IMAGE = require('../../assets/write/profile_img.png');

// type: 'name' | 'id' | 'empty'
// name      — 이미지 + 이름/tailText 행
// id        — 이미지 + @id
// empty     — 수신인 선택 chip만
// imageOnly — 이미지만 (편지 커버 등에서 사용)
export default function Profile({
  name = 'nickname',
  id,
  tailText,
  imageSource,
  imageOnly = false,
  type = 'name',
  onPress,
  style,
}) {
  const isEmpty = type === 'empty';
  const isHorizontal = type === 'id';
  const currentImageSource = imageSource
    ? typeof imageSource === 'string'
      ? { uri: imageSource }
      : imageSource
    : DEFAULT_PROFILE_IMAGE;

  if (imageOnly) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={currentImageSource}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.container, isEmpty && styles.containerEmpty, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      {isEmpty ? (
        <View style={styles.emptyChip}>
          <Text style={styles.emptyText} numberOfLines={1}>수신인 선택</Text>
        </View>
      ) : (
        <>
          <Image
            source={currentImageSource}
            style={styles.profileImage}
            resizeMode="cover"
          />
          {isHorizontal ? (
            <Text style={styles.idText} numberOfLines={1}>@{id}</Text>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              {tailText && (
                <Text style={styles.name} numberOfLines={1}>{tailText}</Text>
              )}
            </View>
          )}
        </>
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
  containerEmpty: {
    gap: 0,
  },
  emptyChip: {
    backgroundColor: colors.bgLayerWeak,
    borderRadius: radius.M,
    paddingHorizontal: padding.M,
    paddingVertical: padding.S,
  },
  emptyText: {
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typo.labelSmall,
    color: colors.fgLayerNeutral,
  },
  idText: {
    ...typo.labelSmall,
    color: colors.fgLayerNeutral,
  },
});
