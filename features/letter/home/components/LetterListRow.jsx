import { View, Text, StyleSheet, Pressable } from 'react-native';
import { palette, colors } from '../../../../shared/styles/color';
import { gap, padding } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';

const BAR_COLORS = [
  palette.mongle[10],
  palette.mongle[20],
  palette.mongle[30],
  palette.mongle[40],
  palette.mongle[50],
  palette.mongle[60],
  colors.fgNeutral,
];


export default function LetterListRow({ date, letters = [], onPressLetter }) {
  return (
    <View style={styles.row}>
      <View style={styles.dateColumn}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.count}>{letters.length}통</Text>
      </View>
      <View style={styles.barColumn}>
        {letters.map((letter, index) => (
          <Pressable
            key={letter.id ?? index}
            onPress={() => onPressLetter?.(letter)}
          >
            <View
              style={[styles.bar, { height: 2 + index, backgroundColor: BAR_COLORS[(letter.id ?? index) % BAR_COLORS.length] }]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
    paddingHorizontal: padding.XL,
    paddingVertical: padding.L,
    width: '100%',
  },
  dateColumn: {
    width: 72,
    gap: gap.S,
    justifyContent: 'center',
  },
  date: {
    ...typo.bodyMedium,
    color: colors.fgNeutral,
  },
  count: {
    ...typo.captionMedium,
    color: colors.fgPlaceholder,
  },
  barColumn: {
    flex: 1,
    gap: gap.S,
  },
  bar: {
    width: '100%',
  },
});
