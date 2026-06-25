import { Pressable, View, StyleSheet } from 'react-native';
import { radius } from '../../../shared/styles/token';

export default function StampItem({ SvgComponent, isSelected = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.imageWrapper, isSelected && styles.imageWrapperSelected]}>
        {SvgComponent && (
          <SvgComponent width="100%" height="100%" />
        )}
      </View>
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
    opacity: 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
