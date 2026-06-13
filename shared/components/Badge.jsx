import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { typo } from '../styles/typo';

const BADGE_SIZE = 24;

export default function Badge({ label = 'N', style }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: colors.fgCritical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typo.labelSmall,
    color: '#ffffff',
  },
});
