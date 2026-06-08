import { Pressable, StyleSheet } from 'react-native';
import { colors, shadow } from '../styles/color';
import IcPlus from '../../assets/icons/ic_plus.svg';

const ICON_SIZE = 18;

export default function FAB({ onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <IcPlus width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 44,
    backgroundColor: colors.bgBrandSolid,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.middleDown,
  },
});
