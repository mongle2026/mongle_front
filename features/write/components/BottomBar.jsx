import { useEffect, useState } from 'react';
import { Keyboard, Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ButtonIcon from '../../../shared/components/ButtonIcon';
import { colors } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';

import ImageIcon from '../../../assets/icons/ic_image.svg';
import ImageDisabledIcon from '../../../assets/icons/ic_image_disabled.svg';

const KEYBOARD_EXTRA_OFFSET = Platform.OS === 'android' ? 48 : 0;

export default function BottomBar({
  onPressImage,
  disabledImage = false,
}) {
  const CurrentImageIcon = disabledImage ? ImageDisabledIcon : ImageIcon;

  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', event => {
      console.log('keyboardDidShow:', event.endCoordinates.height);
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      console.log('keyboardDidHide');
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    // <Animated.View style={[styles.container, bottomBarStyle]}>
    <View
      style={[
        styles.container,
        {
          bottom: keyboardHeight > 0
            ? keyboardHeight + KEYBOARD_EXTRA_OFFSET
            : insets.bottom,
        },
      ]}
    >
      <ButtonIcon
        Icon={CurrentImageIcon}
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
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgDefault,
  },
});