import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

export default function Caption({ date = '' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{date}</Text>
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
  text: {
    ...typo.captionSmall,
    color: palette.gray[40],
    flex: 1,
  },
});
