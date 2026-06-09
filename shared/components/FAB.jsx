import { useState, useRef } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

import { colors, shadow } from '../styles/color';
import { gap, padding } from '../styles/token';
import { typo } from '../styles/typo';
import IcPlus from '../../assets/icons/ic_plus.svg';
import IcLetter from '../../assets/icons/ic_letter.svg';
import IcPaper from '../../assets/icons/ic_paper.svg';

const ICON_SIZE = 18;
const FAB_SIZE = 44;
const TIMING = { duration: 200, easing: Easing.out(Easing.cubic) };

export default function FAB({ onPressFeed, onPressLetter }) {
  const [open, setOpen] = useState(false);
  const [fabPos, setFabPos] = useState({ left: 0, bottom: 0 });
  const [subWidth, setSubWidth] = useState(0);
  const mainRef = useRef(null);
  const progress = useSharedValue(0);

  const toggle = () => {
    const next = !open;
    if (next) {
      mainRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const { height: screenHeight } = Dimensions.get('window');
        setFabPos({
          left: pageX + width / 2,
          bottom: screenHeight - pageY - height,
        });
      });
    }
    setOpen(next);
    progress.value = withTiming(next ? 1 : 0, TIMING);
  };

  const close = () => {
    setOpen(false);
    progress.value = withTiming(0, TIMING);
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
    <>
      <Modal visible={open} transparent animationType="none" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} />
        {/* sub 버튼들: FAB 오른쪽 정렬, 바로 위에 위치 */}
        <Animated.View
          style={[styles.subButtons, subStyle, {
            left: fabPos.left - subWidth / 2,
            bottom: fabPos.bottom + FAB_SIZE + gap.M,
          }]}
          pointerEvents="box-none"
          onLayout={e => setSubWidth(e.nativeEvent.layout.width)}
        >
          <Pressable style={styles.sub} onPress={() => { close(); onPressFeed?.(); }}>
            <IcPaper width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
            <Text style={styles.subText}>피드 게시</Text>
          </Pressable>
          <Pressable style={styles.sub} onPress={() => { close(); onPressLetter?.(); }}>
            <IcLetter width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
            <Text style={styles.subText}>편지 전송</Text>
          </Pressable>
        </Animated.View>
      </Modal>

      {/* 메인 버튼: open 시 흰 배경 + 회색 × */}
      <Pressable ref={mainRef} onPress={toggle}>
        <Animated.View style={[styles.main, mainBgStyle]}>
          <Animated.View style={iconRotateStyle}>
            <IcPlus
              width={ICON_SIZE}
              height={ICON_SIZE}
              color={open ? colors.fgLayerNeutralWeak : colors.fgNeutral}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.middleDown,
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
});
