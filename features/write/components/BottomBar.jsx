import { useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard, Platform } from 'react-native';

import ButtonIcon from '../../../shared/components/ButtonIcon';
import { colors } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';

import ImageIcon from '../../../assets/icons/ic_image.svg';

export default function BottomBar({
  onPressImage,
  disabledImage = false,
}) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const paddingBottom = Platform.OS === 'ios' && !keyboardVisible ? padding.M : 0;

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
