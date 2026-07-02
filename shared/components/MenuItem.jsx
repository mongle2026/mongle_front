import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../styles/color';
import { gap, padding } from '../styles/token';
import { typo } from '../styles/typo';

const ICON_SIZE = 16;

export default function MenuItem({
  Icon,
  label,
  textColor = colors.fgLayerNeutral,
  onPress,
}) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon width={ICON_SIZE} height={ICON_SIZE} color={textColor} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: gap.M,
    paddingHorizontal: padding.XXL,
    paddingVertical: padding.XL,
    backgroundColor: colors.bgLayerDefault,
  },
  label: {
    ...typo.labelMedium,
    lineHeight: undefined,
  },
});
