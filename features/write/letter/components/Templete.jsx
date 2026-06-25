import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../../../../shared/styles/color';
import { gap, padding, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';


export default function Templete({ label, PatternSvg, StampSvg, isSelected = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.container, isSelected ? styles.containerSelected : styles.containerUnselected]}>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <View style={styles.preview}>
        {/* 패턴 썸네일 */}
        <View style={styles.patternBox}>
          {PatternSvg && (
            <View style={styles.patternSvgWrap}>
              <PatternSvg width={132} height={132} preserveAspectRatio="xMidYMid slice" />
            </View>
          )}
        </View>

        {/* 우표 */}
        <View style={styles.stampBox}>
          {StampSvg && (
            <StampSvg width="100%" height="100%" />
          )}
        </View>
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    gap: gap.M,
    padding: padding.M,
    borderRadius: radius.XS,
  },
  containerUnselected: {
    backgroundColor: colors.bgDefault,
  },
  label: {
    ...typo.titleXSmall,
    color: colors.fgNeutral,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
  },
  containerSelected: {
    backgroundColor: colors.bgDefaultWeak,
  },
  patternBox: {
    width: 88,
    height: 88,
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
  patternSvgWrap: {
    position: 'absolute',
    top: -8,
    left: 0,
  },
  stampBox: {
    width: 59,
    height: 88,
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
});
