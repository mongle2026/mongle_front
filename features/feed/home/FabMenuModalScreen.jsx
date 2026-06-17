import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, shadow } from '../../../shared/styles/color';
import { gap, padding } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';
import IcPlus from '../../../assets/icons/ic_plus.svg';
import IcLetter from '../../../assets/icons/ic_letter.svg';
import IcPaper from '../../../assets/icons/ic_paper.svg';
import { useRecordFormStore } from '../../write/record/store/useRecordFormStore';

const ICON_SIZE = 18;
const FAB_SIZE = 44;
const TIMING = { duration: 200, easing: Easing.out(Easing.cubic) };

export default function FabMenuModalScreen({ navigation, route }) {
  const fabPos = route.params?.fabPos ?? { left: 0, bottom: 0 };
  const setRecordType = useRecordFormStore(state => state.setRecordType);
  const [subWidth, setSubWidth] = useState(0);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, TIMING);
  }, [progress]);

  const closeModal = () => {
    navigation.goBack();
  };

  const closeOnly = () => {
    progress.value = withTiming(0, TIMING, finished => {
      if (finished) {
        runOnJS(closeModal)();
      }
    });
  };

  const goToRecord = (type) => {
    setRecordType(type);

    navigation.goBack();

    requestAnimationFrame(() => {
      navigation.navigate('Record');
    });
  };

  const moveToRecord = (type) => {
    progress.value = withTiming(0, TIMING, finished => {
      if (finished) {
        runOnJS(goToRecord)(type);
      }
    });
  };

  const iconRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 45}deg` }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 16 }],
  }));

  const mainBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.bgBrandSolid, colors.bgLayerDefault],
    ),
  }));

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backdrop} onPress={closeOnly} />

      <Animated.View
        style={[
          styles.subButtons,
          subStyle,
          {
            left: fabPos.left - subWidth / 2,
            bottom: fabPos.bottom + FAB_SIZE + gap.M,
          },
        ]}
        pointerEvents="box-none"
        onLayout={e => setSubWidth(e.nativeEvent.layout.width)}
      >
        <Pressable
          style={styles.sub}
          onPress={() => moveToRecord('FEED')}
        >
          <IcPaper
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={colors.fgNeutral}
          />
          <Text style={styles.subText}>피드 게시</Text>
        </Pressable>

        <Pressable
          style={styles.sub}
          onPress={() => moveToRecord('LETTER')}
        >
          <IcLetter
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={colors.fgNeutral}
          />
          <Text style={styles.subText}>편지 전송</Text>
        </Pressable>
      </Animated.View>

      <Pressable
        style={[
          styles.mainButtonWrapper,
          {
            left: fabPos.left - FAB_SIZE / 2,
            bottom: fabPos.bottom,
          },
        ]}
        onPress={closeOnly}
      >
        <Animated.View style={[styles.main, mainBgStyle]}>
          <Animated.View style={iconRotateStyle}>
            <IcPlus
              width={ICON_SIZE}
              height={ICON_SIZE}
              color={colors.fgLayerNeutralWeak}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  subButtons: {
    position: 'absolute',
    alignItems: 'center',
    gap: gap.M,
  },
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: gap.M,
    paddingHorizontal: padding.XL,
    paddingVertical: padding.L,
    borderRadius: 200,
    backgroundColor: colors.bgBrandSolid,
    ...shadow.middleDown,
  },
  subText: {
    ...typo.labelSmall,
    color: colors.fgNeutral,
  },
  mainButtonWrapper: {
    position: 'absolute',
  },
  main: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.middleDown,
  },
});