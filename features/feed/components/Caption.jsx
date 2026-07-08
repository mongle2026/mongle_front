import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../../../shared/styles/color';
import { gap, padding } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

export default function Caption({
  date = '',
  bookmarkCount = 0,
  isEdited = false,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <Text style={styles.text}>{date}</Text>

        {isEdited && (
          <Text style={styles.text}>수정됨</Text>
        )}
      </View>
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
    paddingTop: padding.M,
    paddingRight: padding.XL,
    paddingBottom: padding.XL,
    paddingLeft: padding.XL,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
  },
  
  text: {
    ...typo.captionSmall,
    color: palette.gray[40],
  },
});
