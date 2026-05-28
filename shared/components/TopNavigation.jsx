import { View, Text, StyleSheet } from 'react-native';

import SafeArea from './SafeArea';
import ButtonIcon from './ButtonIcon';
import ButtonText from './ButtonText';

import ChevronIcon from '../../assets/icons/ic_chevron.svg';

import { colors } from '../styles/color';
import { padding } from '../styles/token';
import { typo } from '../styles/typo';

export default function TopNavigation({
  title = 'Title',
  buttonLabel = '버튼',
  onPressBack,
  onPressButton,
  showBackButton = true,
  showTextButton = true,
  buttonDisabled = false,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <SafeArea />

      <View style={styles.navigation}>
        <View style={styles.leftSide}>
          {showBackButton && (
            <ButtonIcon
              Icon={ChevronIcon}
              size="L"
              variant="none"
              onPress={onPressBack}
            />
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightSide}>
          {showTextButton && (
            <ButtonText
              label={buttonLabel}
              type="brand"
              disabled={buttonDisabled}
              onPress={onPressButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const SIDE_MIN_WIDTH = 64;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.bgDefault,
    alignItems: 'flex-start',
  },
  navigation: {
    width: '100%',
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.M,
  },
  leftSide: {
    minWidth: SIDE_MIN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightSide: {
    minWidth: SIDE_MIN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  title: {
    flex: 1,
    flexShrink: 1,
    ...typo.labelMedium,
    color: colors.fgNeutral,
    textAlign: 'center',
  },
});
