import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, palette } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { padding, gap, radius } from '../../../shared/styles/token';

export default function TopNavigationItem({ label = '', isActive = false, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
      <View style={[styles.bar, isActive && styles.barActive]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    paddingTop: padding.M,
    alignItems: 'center',
    gap: gap.M,
  },
  label: {
    ...typo.labelMedium,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  labelActive: {
    color: colors.fgNeutral,
  },
  labelInactive: {
    color: colors.fgNeutralWeak,
  },
  bar: {
    height: 1,
    width: 36,
    borderRadius: radius.XS,
    backgroundColor: colors.fgNeutral,
    opacity: 0,
  },
  barActive: {
    opacity: 1,
  },
});
