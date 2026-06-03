import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../../shared/styles/color';
import { radius } from '../../../shared/styles/token';

export default function PatternItem({ thumbnail, isSelected = false, onPress }) {
  const SvgImage = thumbnail?.default ?? thumbnail;
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.imageWrapper, isSelected && styles.imageWrapperSelected]}>
        <SvgImage width="100%" height="100%" />
      </View>
      {isSelected && <View style={styles.border} pointerEvents="none" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
  imageWrapperSelected: {
    opacity: 0.7,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.XS,
    borderWidth: 2,
    borderColor: colors.strokeNeutralWeak,
  },
});
