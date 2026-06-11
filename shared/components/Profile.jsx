import { Image, Text, View, StyleSheet, Pressable } from 'react-native';

import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

const DEFAULT_PROFILE_IMAGE = require('../../assets/write/profile_img.png');

// type: 'vertical' | 'horizontal' | 'empty'
// vertical   — 이미지 + 텍스트 column (이름/tailText 위, @id 아래)
// horizontal — 이미지 + 텍스트 row   (이름/tailText 와 @id 나란히)
// empty      — 수신인 선택 chip만
// imageOnly  — 이미지만 (편지 커버 등에서 사용)
export default function Profile({
  name = 'nickname',
  id,
  tailText,
  imageSource,
  imageOnly = false,
  type = 'vertical',
  onPress,
  style,
}) {
  const isEmpty = type === 'empty';
  const isHorizontal = type === 'horizontal';
  const currentImageSource = imageSource || DEFAULT_PROFILE_IMAGE;

  if (imageOnly) {
    return (
      <Image
        source={currentImageSource}
        style={[styles.profileImage, style]}
        resizeMode="cover"
      />
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
          <View style={[styles.textContainer, isHorizontal && styles.textContainerHorizontal]}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              {tailText && (
                <Text style={styles.name} numberOfLines={1}>{tailText}</Text>
              )}
            </View>
            {id && (
              <Text style={styles.idText} numberOfLines={1}>@{id}</Text>
            )}
          </View>
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
    borderRadius: radius.XS,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: gap.XS,
  },
  textContainerHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.XS,
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
    ...typo.captionSmall,
    color: colors.fgNeutralWeak,
  },
});
