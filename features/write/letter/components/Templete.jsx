import { Pressable, Text, Image, View, StyleSheet } from 'react-native';
import { colors } from '../../../../shared/styles/color';
import { gap, padding, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';

export default function Templete({ label, imageSource, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected && styles.containerSelected]}
    >
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <View style={styles.preview}>
        {imageSource && (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: gap.XS,
    padding: padding.M,
    borderRadius: radius.M,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: colors.fgBrand,
  },
  label: {
    ...typo.titleXSmall,
    color: colors.fgNeutral,
  },
  preview: {
    width: 160,
    height: 64,
    borderRadius: radius.XS,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
