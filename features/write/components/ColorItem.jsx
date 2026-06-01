import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../../shared/styles/color';

export default function ColorItem({ color, isSelected = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.circle, isSelected && styles.circleSelected, { backgroundColor: color }]} />
      {isSelected && <View style={styles.border} pointerEvents="none" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  circleSelected: {
    opacity: 0.7,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.strokeNeutralWeak,
  },
});
