import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../styles/color';
import { padding } from '../styles/token';
import { typo } from '../styles/typo';

export default function ListHeader({
  title = '애플뮤직에서 인기있는 곡 - 10개',
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.XL,
    paddingVertical: padding.M,
  },
  title: {
    flex: 1,
    ...typo.titleMedium,
    color: colors.fgLayerNeutral,
    textAlign: 'left',
  },
});