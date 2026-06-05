import { useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard, Platform } from 'react-native';

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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: keyboardVisible ? padding.S : padding.L }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgDefault,
  },
});