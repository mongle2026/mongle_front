import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import EnvelopePreview from '../../../../shared/components/EnvelopePreview';

import {
  PATTERNS,
  STAMPS,
  useLetterCoverStore,
} from '../../letter/data/letterCoverData';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';

function resolveSvgComponent(svgSource) {
  return svgSource?.default ?? svgSource;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function SelectedLetterCoverPreview() {
  const { patternId, colorId, stampId } = useLetterCoverStore();
  const recordForm = useRecordFormStore();

  const rotateY = useSharedValue(0);

  const selectedPattern = PATTERNS.find(pattern => pattern.id === patternId);
  const selectedColor = selectedPattern?.colors.find(color => color.id === colorId);
  const selectedStamp = STAMPS.find(stamp => stamp.id === stampId);

  const FrontSvg = resolveSvgComponent(selectedColor?.frontImg);
  const FlapSvg = resolveSvgComponent(selectedColor?.flapImg);
  const BackSvg = resolveSvgComponent(
    selectedColor?.backImg ?? selectedColor?.frontImg
  );

  const handlePressEnvelope = useCallback(() => {
    rotateY.value = withTiming(rotateY.value === 0 ? 180 : 0, {
      duration: 450,
    });
  }, [rotateY]);

  const frontAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  const backAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value + 180}deg` },
    ],
  }));

  return (
    <EnvelopePreview
      FrontSvg={FrontSvg}
      FlapSvg={FlapSvg}
      BackSvg={BackSvg}
      selectedStamp={selectedStamp}
      frontAnimStyle={frontAnimStyle}
      backAnimStyle={backAnimStyle}
      onPress={handlePressEnvelope}
      showProfile={false}
      imageSource={
        recordForm.receiver.hasProfileImage && recordForm.receiver.profileImageUrl
          ? `${API_BASE_URL}${recordForm.receiver.profileImageUrl}`
          : null
      }
    />
  );
}