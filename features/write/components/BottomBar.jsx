import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ButtonIcon from '../../../shared/components/ButtonIcon';
import { colors } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';

import ImageIcon from '../../../assets/icons/ic_image.svg';

export default function BottomBar({
  onPressImage,
  disabledImage = false,
}) {
  const insets = useSafeAreaInsets();
  const paddingBottom = padding.M;

  return (
    <View style={[styles.container, { paddingBottom }]}>
      <ButtonIcon
        Icon={ImageIcon}
        iconColor={disabledImage ? colors.fgDisabled : undefined}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgDefault,
  },
});
