import { Dimensions, StyleSheet, View } from 'react-native';

import {
  PATTERNS,
  STAMPS,
  useLetterCoverStore,
} from '../../letter/data/letterCoverData';

import { padding } from '../../../../shared/styles/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ENVELOPE_WIDTH = SCREEN_WIDTH - padding.XL * 2;
const ENVELOPE_HEIGHT = ENVELOPE_WIDTH * (253.33 / 342.6);

const ENV_MARGIN_H = ENVELOPE_WIDTH * (15.8 / 342.6);
const ENV_MARGIN_V = ENVELOPE_WIDTH * (13.92 / 342.6);

export default function SelectedLetterCoverPreview() {
  const { patternId, colorId, stampId } = useLetterCoverStore();

  const selectedPattern = PATTERNS.find(pattern => pattern.id === patternId);
  const selectedColor = selectedPattern?.colors.find(color => color.id === colorId);
  const selectedStamp = STAMPS.find(stamp => stamp.id === stampId);

  const backSrc = selectedColor?.backImg ?? selectedColor?.frontImg;
  const BackSvg = backSrc?.default ?? backSrc;
  const StampSvg = selectedStamp?.SvgComponent;

  return (
    <View style={styles.envelopeContainer}>
      {BackSvg && (
        <BackSvg
          width={ENVELOPE_WIDTH}
          height={ENVELOPE_HEIGHT}
        />
      )}

      {StampSvg && (
        <View style={styles.stamp}>
          <StampSvg width="100%" height="100%" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  envelopeContainer: {
    width: ENVELOPE_WIDTH,
    height: ENVELOPE_HEIGHT,
  },
  stamp: {
    position: 'absolute',
    top: ENV_MARGIN_V + padding.XL,
    left: ENV_MARGIN_H + padding.XL,
    width: 72,
    height: 106,
  },
});