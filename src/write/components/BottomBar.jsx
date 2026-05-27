import { View, StyleSheet } from 'react-native';

import ButtonIcon from '../../../shared/components/ButtonIcon';
import { colors } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';

import ImageIcon from '../../../assets/icons/ic_image.svg';
import ImageDisabledIcon from '../../../assets/icons/ic_image_disabled.svg';

export default function BottomBar({
  onPressImage,
  disabledImage = false,
}) {
  const CurrentImageIcon = disabledImage ? ImageDisabledIcon : ImageIcon;

  return (
    <View style={styles.container}>
      <ButtonIcon
        Icon={CurrentImageIcon}
        size="L"
        variant="none"
        disabled={disabledImage}
        onPress={onPressImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgDefault,
  },
});