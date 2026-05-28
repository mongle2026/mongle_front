import { View, Text, StyleSheet } from 'react-native';

import ButtonText from './ButtonText';
import { colors, shadow } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

import FilledCheckIcon from '../../assets/icons/ic_filledcheck.svg';
import WarningIcon from '../../assets/icons/ic_warning.svg';

const TOAST_ICON = {
  success: FilledCheckIcon,
  warning: WarningIcon,
};

export default function Toast({
  message = '2,000자 이내로 내용을 줄여주세요.',
  type = 'warning',
  actionLabel,
  onPressAction,
  style,
}) {
  const Icon = TOAST_ICON[type];

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <Icon width={20} height={20} />

        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        {actionLabel && (
          <ButtonText
            label={actionLabel}
            type="neutral"
            onPress={onPressAction}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: padding.M,
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: padding.XL,
    paddingTop: padding.S,
    paddingRight: padding.M,
    paddingBottom: padding.S,
    gap: gap.M,
    borderRadius: radius.M,
    backgroundColor: colors.gray[80],
    ...shadow.middleDown,
  },
  message: {
    flex: 1,
    ...typo.bodyMediumStrong,
    color: colors.fgNeutral,
    textAlign: 'left',
  },
});