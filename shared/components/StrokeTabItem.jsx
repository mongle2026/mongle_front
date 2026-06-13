import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { padding } from '../styles/token';
import { typo } from '../styles/typo';

export default function StrokeTabItem({ label, isActive = false, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, isActive ? styles.activeContainer : styles.inactiveContainer, style]}
    >
      <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.L,
    borderBottomWidth: 1,
  },
  activeContainer: {
    borderBottomWidth: 2,
    borderBottomColor: colors.fgNeutral,
  },
  inactiveContainer: {
    borderBottomColor: colors.bgSurface,
  },
  label: {
    ...typo.labelMedium,
  },
  activeLabel: {
    color: colors.fgNeutral,
  },
  inactiveLabel: {
    color: colors.bgSurface,
  },
});
