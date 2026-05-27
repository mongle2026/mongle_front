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
      <Icon width={16} height={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    padding: padding.L,
    borderRadius: radius.XS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
});