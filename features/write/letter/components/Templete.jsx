import { Pressable, Text, View, Image, StyleSheet } from 'react-native';
import { colors } from '../../../../shared/styles/color';
import { gap, padding, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';


export default function Templete({ label, PatternSvg, color, stampImage, isSelected = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.container, isSelected ? styles.containerSelected : styles.containerUnselected]}>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      <View style={styles.preview}>
        {/* 패턴 썸네일 */}
        <View style={styles.patternBox}>
          {PatternSvg && (
            <View style={styles.patternSvgWrap}>
              <PatternSvg width={146} height={109} />
            </View>
          )}
        </View>

{/* 우표 */}
        <View style={styles.stampBox}>
          {stampImage && (
            <Image source={stampImage} style={styles.stampImage} resizeMode="cover" />
          )}
        </View>
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    height: 88,
    borderRadius: radius.XS,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
  },
  patternSvgWrap: {
    position: 'absolute',
    left: -29,
    top: -10,
  },
  stampBox: {
    width: 59,
    height: 88,
    borderRadius: radius.XS,
    backgroundColor: colors.bgSurface,
    overflow: 'hidden',
  },
  stampImage: {
    width: '100%',
    height: '100%',
  },
});
