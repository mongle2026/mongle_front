import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../../../shared/styles/color';
import { gap, padding } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

export default function Caption({ date = '', bookmarkCount = 0 }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{date}</Text>
      <Text style={styles.text}>북마크 {bookmarkCount}회</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.XL,
    paddingVertical: padding.M,
  },
  text: {
    ...typo.captionSmall,
    color: palette.gray[40],
  },
});
