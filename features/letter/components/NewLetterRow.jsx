import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import EnvelopePreview from '../../../shared/components/EnvelopePreview';
import { gap, padding } from '../../../shared/styles/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.8);
const CARD_HEIGHT = Math.round(CARD_WIDTH * (253.33 / 342.6));
const CARD_HEIGHT_WITH_ROTATION = CARD_HEIGHT + 40;
const ENV_WIDTH = SCREEN_WIDTH - padding.XL * 2;
const ENV_HEIGHT = ENV_WIDTH * (253.33 / 342.6);
const SCALE = CARD_WIDTH / ENV_WIDTH;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const ITEM_WIDTH = CARD_WIDTH + gap.XS;

function FlippableEnvelope({ letter, rotate }) {
  const flipProgress = useSharedValue(0);

  const handleLongPress = () => {
    flipProgress.value = withTiming(flipProgress.value === 0 ? 1 : 0, { duration: 500 });
  };

  const frontAnimStyle = useAnimatedStyle(() => {
    const spin = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return { transform: [{ perspective: 800 }, { rotateY: `${spin}deg` }] };
  });

  const backAnimStyle = useAnimatedStyle(() => {
    const spin = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return { transform: [{ perspective: 800 }, { rotateY: `${spin}deg` }] };
  });

  const FrontSvg = letter.frontImg?.default ?? letter.frontImg;
  const FlapSvg = letter.flapImg?.default ?? letter.flapImg;
  const BackSvg = FrontSvg;

  return (
    <View style={styles.card}>
      <View style={[styles.scaleContainer, { transform: [...styles.scaleContainer.transform, { rotate }] }]}>
        <EnvelopePreview
          FrontSvg={FrontSvg}
          FlapSvg={FlapSvg}
          BackSvg={BackSvg}
          selectedStamp={letter.stamp}
          frontAnimStyle={frontAnimStyle}
          backAnimStyle={backAnimStyle}
          onLongPress={handleLongPress}
          isNew
        />
      </View>
    </View>
  );
}

export default function NewLetterRow({ letters = [] }) {
  if (letters.length === 0) return null;

  const snapOffsets = letters.map((_, i) => i * ITEM_WIDTH);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.container}
      snapToOffsets={snapOffsets}
      decelerationRate="fast"
    >
      {letters.map((letter) => {
        const rotate = (Math.random() * 8 - 4).toFixed(2) + 'deg';
        return <FlippableEnvelope key={letter.id} letter={letter} rotate={rotate} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT_WITH_ROTATION + padding.XL * 2,
    flexShrink: 0,
  },
  content: {
    gap: gap.XS,
    paddingHorizontal: SIDE_PADDING,
    paddingVertical: padding.XL,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT_WITH_ROTATION,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleContainer: {
    width: ENV_WIDTH,
    height: ENV_HEIGHT,
    transform: [
      { translateX: (SCALE - 1) * ENV_WIDTH / 2 },
      { translateY: (SCALE - 1) * ENV_HEIGHT / 2 },
      { scale: SCALE },
    ],
  },
});
