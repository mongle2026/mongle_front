import { Pressable, View, Image, StyleSheet } from 'react-native';
import { radius } from '../../../shared/styles/token';
import { colors } from '../../../shared/styles/color';

export default function StampItem({ image, isSelected = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.imageWrapper, isSelected && styles.imageWrapperSelected]}>
        {image && (
          <Image source={image} style={styles.image} resizeMode="cover" />
        )}
      </View>
      {isSelected && <View style={styles.border} pointerEvents="none" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 105 / 154,
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
  image: {
    width: '100%',
    height: '100%',
  },
});
