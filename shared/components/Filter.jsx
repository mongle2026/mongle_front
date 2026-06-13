import { Pressable, Text, StyleSheet } from 'react-native';
import IcDropdown from '../../assets/icons/ic_dropdown.svg';
import { colors } from '../styles/color';
import { gap, padding } from '../styles/token';
import { typo } from '../styles/typo';

export default function Filter({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <IcDropdown width={8} height={8} color={colors.fgNeutral} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
    paddingLeft: padding.M,
    paddingRight: padding.S,
    paddingVertical: padding.S,
  },
  label: {
    ...typo.labelSmall,
    color: colors.fgNeutral,
  },
});
