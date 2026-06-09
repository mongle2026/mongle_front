import { useEffect, useState } from 'react';
import { Keyboard, Platform, View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const insets = useSafeAreaInsets();
  const [keyboardBottom, setKeyboardBottom] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', event => {
      const windowHeight = Dimensions.get('window').height;
      const keyboardTopY = event.endCoordinates.screenY;

      const keyboardHeightInWindow = Math.max(0, windowHeight - keyboardTopY);

      console.log('keyboard event height:', event.endCoordinates.height);
      console.log('keyboard height in window:', keyboardHeightInWindow);
      console.log('bottom inset:', insets.bottom);

      setKeyboardBottom(keyboardHeightInWindow);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardBottom(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  const bottomValue =
    keyboardBottom > 0
      ? keyboardBottom
      : insets.bottom;

  return (
    // <Animated.View style={[styles.container, bottomBarStyle]}>
    <View
      style={[
        styles.container,
        {
          bottom: bottomValue
        },
      ]}
    >
      <ButtonIcon
        Icon={ImageIcon}
        iconColor={disabledImage ? colors.fgDisabled : undefined}
        size="L"
        variant="none"
        disabled={disabledImage}
        onPress={onPressImage}
      />
    </View>
    // </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgDefault,
  },
});