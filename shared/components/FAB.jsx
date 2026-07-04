import { useRef } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';

import { colors, shadow } from '../styles/color';
import IcPlus from '../../assets/icons/ic_plus.svg';

const ICON_SIZE = 18;
const FAB_SIZE = 44;

export default function FAB({ onPress }) {
  const mainRef = useRef(null);

  const handlePress = () => {
    mainRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const { height: screenHeight } = Dimensions.get('window');

      onPress?.({
        left: pageX + width / 2,
        bottom: screenHeight - pageY - height,
      });
    });
  };

  return (
    <Pressable ref={mainRef} onPress={handlePress} style={styles.main}>
      <IcPlus
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={colors.fgNeutral}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgBrandSolid,
    ...shadow.middleDown,
  },
});