import { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import Profile from '../../../shared/components/Profile';
import FlapShadow from '../../../shared/components/FlapShadow';
import { PATTERNS, useLetterCoverStore } from '../letter/data/letterCoverData';
import { colors, shadow } from '../../../shared/styles/color';
import { padding } from '../../../shared/styles/token';
import { useRecordFormStore } from '../record/store/useRecordFormStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ENVELOPE_WIDTH = SCREEN_WIDTH - padding.XL * 2;
const ENVELOPE_HEIGHT = ENVELOPE_WIDTH * (253.33 / 342.6);
const FLAP_RENDER_WIDTH = ENVELOPE_WIDTH * (325.17 / 342.6);
const FLAP_RENDER_HEIGHT = FLAP_RENDER_WIDTH * (173.2 / 325.17);
const FLAP_LEFT = (ENVELOPE_WIDTH - FLAP_RENDER_WIDTH) / 2;
const ENV_MARGIN_H = ENVELOPE_WIDTH * (15.8 / 342.6);
const ENV_MARGIN_V = ENVELOPE_WIDTH * (13.92 / 342.6);

const DISSOLVE_DURATION = 500;
const FLY_IN_DURATION = 900;
const FLY_OUT_DURATION = 600;

const FINAL_SCALE = 48 / ENVELOPE_WIDTH;
const FINAL_TRANSLATE_Y = SCREEN_HEIGHT * 0.38;

const API_BASE_URL = 'http://192.168.0.3:3000';

export default function SendAnimationScreen({ navigation, route }) {
  const { deliveryLabel = '일주일 뒤', toMe = false, receiver = null } = route?.params ?? {};
  const { patternId, colorId } = useLetterCoverStore();
  const recordForm = useRecordFormStore();

  const selectedColor = PATTERNS.find(p => p.id === patternId)?.colors.find(c => c.id === colorId);
  const FrontSvg = selectedColor?.frontImg?.default ?? selectedColor?.frontImg;
  const FlapSvg = selectedColor?.flapImg?.default ?? selectedColor?.flapImg;

  const showToastAndGoHome = () => {
    const toastMessage = toMe === true
      ? `편지가 ${deliveryLabel} 0시의 나에게 전송됐어요.`
      : `편지가 ${receiver}에게 전송됐어요.`;

    recordForm.resetForm();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'FeedHome',
          params: {
            homeToast: {
              id: Date.now(),
              type: 'success',
              message: toastMessage,
            },
          },
        },
      ],
    });
  };

  const screenOpacity = useSharedValue(0);
  const envelopeScale = useSharedValue(1);
  const envelopeTranslateY = useSharedValue(SCREEN_HEIGHT * 0.5);
  const envelopeOpacity = useSharedValue(0);

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: DISSOLVE_DURATION }, () => {
      envelopeOpacity.value = withTiming(1, { duration: 200 });
      envelopeTranslateY.value = withTiming(0, { duration: FLY_IN_DURATION }, () => {
        envelopeScale.value = withTiming(FINAL_SCALE, { duration: FLY_OUT_DURATION });
        envelopeOpacity.value = withTiming(0, { duration: FLY_OUT_DURATION });
        envelopeTranslateY.value = withTiming(FINAL_TRANSLATE_Y, { duration: FLY_OUT_DURATION }, () => {
          runOnJS(showToastAndGoHome)();
        });
      });
    });
  }, []);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  const envelopeStyle = useAnimatedStyle(() => ({
    opacity: envelopeOpacity.value,
    transform: [
      { scale: envelopeScale.value },
      { translateY: envelopeTranslateY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.screen, screenStyle]}>
      <Animated.View style={[styles.envelopeContainer, envelopeStyle]}>
        {FrontSvg && <FrontSvg width={ENVELOPE_WIDTH} height={ENVELOPE_HEIGHT} />}
        {FlapSvg && (
          <View style={[styles.flapWrapper, { height: FLAP_RENDER_HEIGHT }]}>
            {Platform.OS === 'android' && (
              <FlapShadow width={FLAP_RENDER_WIDTH} height={FLAP_RENDER_HEIGHT} />
            )}
            <FlapSvg width={FLAP_RENDER_WIDTH} height={FLAP_RENDER_HEIGHT} />
          </View>
        )}
        <Profile
          imageOnly
          imageSource={
            recordForm.receiver.hasProfileImage && recordForm.receiver.profileImageUrl
              ? `${API_BASE_URL}${recordForm.receiver.profileImageUrl}`
              : null
          }
          style={styles.profileOverlay}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envelopeContainer: {
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
  },
  flapWrapper: {
    position: 'absolute',
    top: padding.M,
    left: FLAP_LEFT,
    width: FLAP_RENDER_WIDTH,
    transform: [{ rotate: '-0.25deg' }, { translateY: -1.4 }],
    ...shadow.middleDown,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: ENV_MARGIN_V + padding.M,
    right: ENV_MARGIN_H + padding.M,
  },
  toast: {
    position: 'absolute',
    bottom: padding.XL,
    left: 0,
    right: 0,
  },
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 999,
    alignItems: 'center',
  },
});
