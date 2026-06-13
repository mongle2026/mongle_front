import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import IcHamburger from '../../assets/icons/ic_hamburger.svg';
import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';

const ICON_SIZE = 24;

export default function TapButtonItem({ icon, isActive = false, onPress, style }) {
  const iconColor = isActive ? colors.fgNeutral : colors.fgNeutralWeak;
  const defaultIcon = <IcHamburger width={ICON_SIZE} height={ICON_SIZE} />;
  const renderedIcon = icon
    ? React.cloneElement(icon, { color: iconColor })
    : React.cloneElement(defaultIcon, { color: iconColor });

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, isActive ? styles.active : styles.inactive, style]}
    >
      {renderedIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.M,
    padding: padding.M,
  },
  active: {
    backgroundColor: colors.bgSurface,
  },
  inactive: {
    backgroundColor: colors.bgDefaultWeak,
  },
});
