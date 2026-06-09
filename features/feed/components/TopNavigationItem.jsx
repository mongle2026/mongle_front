import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, palette } from '../../../shared/styles/color';
import { typo } from '../../../shared/styles/typo';
import { padding, gap, radius } from '../../../shared/styles/token';

export default function TopNavigationItem({ label = '', isActive = false, onPress }) {
  return (
    <Pressable
      style={[styles.container, isActive ? styles.containerActive : styles.containerInactive]}
      onPress={onPress}
    >
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
      <View style={[styles.bar, isActive ? styles.barActive : styles.barInactive]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    paddingTop: padding.M,
    gap: gap.M,
  },
  containerActive: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInactive: {
    alignItems: 'flex-start',
  },
  label: {
    ...typo.labelMedium,
    width: '100%',
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
    borderRadius: radius.XS,
    backgroundColor: colors.fgNeutral,
  },
  barActive: {
    width: 36,
    opacity: 1,
  },
  barInactive: {
    width: '100%',
    opacity: 0,
  },
});
