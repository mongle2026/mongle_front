import { View, Text, StyleSheet } from 'react-native';

import SafeArea from './SafeArea';
import ButtonIcon from './ButtonIcon';
import ButtonText from './ButtonText';

import ChevronIcon from '../../assets/icons/ic_chevron.svg';
import XIcon from '../../assets/icons/ic_x.svg';
import IcNotification from '../../assets/icons/ic_notification.svg';
import LogoTemp from '../../assets/logo/logo_temp.svg';

import { colors } from '../styles/color';
import { padding } from '../styles/token';
import { typo } from '../styles/typo';

const CONTAINER_THEME = {
  dark:  { backgroundColor: colors.bgDefault },
  light: { backgroundColor: colors.bgLayerDefault },
};

const TITLE_THEME = {
  dark:  { color: colors.fgNeutral },
  light: { color: colors.fgLayerNeutral },
};

const ICON_COLOR_THEME = {
  dark:  colors.fgNeutral,
  light: colors.fgLayerNeutral,
};

const ICON_COLOR_DEPTH2_THEME = {
  dark:  colors.fgLayerNeutralWeak,
  light: colors.fgLayerNeutral,
};

// usage="depth1" : 로고 + 알림 아이콘 (메인 탭 화면)
// usage="depth2" : 뒤로가기 + 타이틀 + 텍스트 버튼 (서브 화면, 기본값)
export default function TopNavigation({
  title = 'Title',
  buttonLabel = '버튼',
  onPressBack,
  onPressButton,
  onPressNotification,
  showBackButton = true,
  showTextButton = true,
  buttonDisabled = false,
  backIcon: BackIcon = ChevronIcon,
  theme = 'dark',
  usage = 'depth2',
  type = 'brand',
  style,
}) {
  if (usage === 'depth1') {
    return (
      <View style={[styles.container, CONTAINER_THEME[theme], style]}>
        <SafeArea />
        <View style={styles.depth1Navigation}>
          <View style={styles.logoArea}>
            <LogoTemp width={77} height={24} />
          </View>
          <ButtonIcon
            Icon={IcNotification}
            size="L"
            variant="none"
            iconColor={ICON_COLOR_THEME[theme]}
            onPress={onPressNotification}
          />
        </View>
      </View>
    );
  }

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
              iconColor={ICON_COLOR_DEPTH2_THEME[theme]}
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
  depth1Navigation: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: padding.XL,
    paddingRight: padding.M,
    paddingVertical: padding.M,
  },
  logoArea: {
    width: 100,
    justifyContent: 'center',
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
