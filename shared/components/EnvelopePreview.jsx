import { View, Pressable, StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../styles/color';
import Badge from './Badge';
import Animated from 'react-native-reanimated';

import Profile from './Profile';
import FlapShadow from './FlapShadow';
import { shadow } from '../styles/color';
import { padding } from '../styles/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ENVELOPE_WIDTH = SCREEN_WIDTH - padding.XL * 2;
const ENVELOPE_HEIGHT = ENVELOPE_WIDTH * (253.33 / 342.6);
const FLAP_RENDER_WIDTH = ENVELOPE_WIDTH * (325.17 / 342.6);
const FLAP_RENDER_HEIGHT = FLAP_RENDER_WIDTH * (173.2 / 325.17);
const FLAP_LEFT = (ENVELOPE_WIDTH - FLAP_RENDER_WIDTH) / 2;
const ENV_MARGIN_H = ENVELOPE_WIDTH * (15.8 / 342.6);
const ENV_MARGIN_V = ENVELOPE_WIDTH * (13.92 / 342.6);


export default function EnvelopePreview({
  FrontSvg,
  FlapSvg,
  BackSvg,
  selectedStamp,
  frontAnimStyle,
  backAnimStyle,
  onPress,
  onLongPress,
  profileStyle,
  isNew,
  imageSource = null,
}) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.envelopeContainer}>
      {/* 앞면 */}
      <Animated.View style={[styles.envelopeFace, frontAnimStyle]}>
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
          imageSource={imageSource}
          style={[styles.profileOverlay, profileStyle]}
        />
        {isNew && <Badge style={styles.badge} />}
      </Animated.View>

      {/* 뒷면 */}
      <Animated.View style={[styles.envelopeFace, styles.envelopeFaceBack, backAnimStyle]}>
        {BackSvg && <BackSvg width={ENVELOPE_WIDTH} height={ENVELOPE_HEIGHT} />}
        {selectedStamp?.SvgComponent && (
          <View style={styles.stamp}>
            <selectedStamp.SvgComponent width="100%" height="100%" />
          </View>
        )}
        <Profile
          imageOnly
          imageSource={imageSource}
          style={[styles.profileOverlay, profileStyle]}
        />
        {isNew && <Badge style={styles.badge} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  envelopeContainer: {
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
  },
  envelopeFace: {
    position: 'absolute',
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
    backfaceVisibility: 'hidden',
    zIndex: 1,
  },
  envelopeFaceBack: {
    zIndex: 2,
  },
  flapWrapper: {
    position: 'absolute',
    top: padding.M,
    left: FLAP_LEFT,
    width: FLAP_RENDER_WIDTH,
    transform: [{ rotate: '-0.25deg' }, { translateY: -1.4 }],
    ...Platform.select({ ios: shadow.middleDown }),
  },
  stamp: {
    position: 'absolute',
    top: ENV_MARGIN_V + padding.XL,
    left: ENV_MARGIN_H + padding.XL,
    width: 72,
    height: 106,
  },
  badge: {
    position: 'absolute',
    top: 28,
    right: 28,
    zIndex: 10,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: ENV_MARGIN_V + padding.M,
    right: ENV_MARGIN_H + padding.M,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
