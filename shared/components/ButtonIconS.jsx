import { Pressable, StyleSheet } from 'react-native';
import {colors} from '../styles/color';
import {padding,radius} from '../styles/token';

export default function ButtonIconS({
  Icon,
  onPress,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Icon width={12} height={12} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 28,
    height: 28,
    padding: padding.M,
    borderRadius: radius.XS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgOverlay,
  },
  disabled: {
    opacity: 0.4,
  },
});