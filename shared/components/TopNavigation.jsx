import { View, Text, StyleSheet } from 'react-native';

import SafeArea from './SafeArea';
import ButtonIcon from './ButtonIcon';
import ButtonText from './ButtonText';

import ChevronIcon from '../../assets/icons/ic_chevron.svg';
import XIcon from '../../assets/icons/ic_x.svg';

import { colors } from '../styles/color';
import { padding } from '../styles/token';
import { typo } from '../styles/typo';

// theme='light' 를 명시할 때만 light 배경/텍스트 색상 적용, 기본은 dark
const CONTAINER_THEME = {
  dark: { backgroundColor: colors.bgDefault },
  light: { backgroundColor: colors.bgLayerDefault },
};

const TITLE_THEME = {
  dark: { color: colors.fgNeutral },
  light: { color: colors.fgLayerNeutral },
};

export default function TopNavigation({
  title = 'Title',
  buttonLabel = '버튼',
  onPressBack,
  onPressButton,
  showBackButton = true,
  showTextButton = true,
  buttonDisabled = false,
  backIcon: BackIcon = ChevronIcon,
  theme = 'dark',
  type = 'brand',
  style,
}) {
  return (
    <View style={[styles.container, CONTAINER_THEME[theme], style]}>
      <SafeArea />

      <View style={styles.navigation}>
        <View style={styles.leftSide}>
          {showBackButton && (
            <ButtonIcon
              Icon={BackIcon}
              size="L"
              variant="none"
              onPress={onPressBack}
            />
          )}
        </View>

        <Text style={[styles.title, TITLE_THEME[theme]]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightSide}>
          {showTextButton && (
            <ButtonText
              label={buttonLabel}
              type={type}
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
    textAlign: 'center',
  },
});
