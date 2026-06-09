import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors, shadow } from '../styles/color';
import { gap, padding, radius } from '../styles/token';
import { typo } from '../styles/typo';
import IcPlus from '../../assets/icons/ic_plus.svg';
import IcLetter from '../../assets/icons/ic_letter.svg';
import IcPaper from '../../assets/icons/ic_paper.svg';

const ICON_SIZE = 18;

const TIMING = { duration: 200, easing: Easing.out(Easing.cubic) };

export default function FAB({ onPressFeed, onPressLetter }) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    progress.value = withTiming(next ? 1 : 0, TIMING);
  };

  const close = () => {
    setOpen(false);
    progress.value = withTiming(0, TIMING);
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 45}deg` }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 16 }],
  }));

  return (
    <>
      <Modal visible={open} transparent animationType="none" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close} />
        <View style={styles.fabPosition} pointerEvents="box-none">
          <Animated.View style={[styles.subButtons, subStyle]}>
            <Pressable style={styles.sub} onPress={() => { close(); onPressFeed?.(); }}>
              <IcPaper width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
              <Text style={styles.subText}>피드 게시</Text>
            </Pressable>
            <Pressable style={styles.sub} onPress={() => { close(); onPressLetter?.(); }}>
              <IcLetter width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
              <Text style={styles.subText}>편지 전송</Text>
            </Pressable>
          </Animated.View>
          <Pressable style={styles.close} onPress={close}>
            <Animated.View style={iconStyle}>
              <IcPlus
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={colors.fgLayerNeutralWeak}
              />
            </Animated.View>
          </Pressable>
        </View>
      </Modal>

      <Pressable style={styles.main} onPress={toggle}>
        <Animated.View style={iconStyle}>
          <IcPlus
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={colors.fgNeutral}
          />
        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  // default
  main: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.bgBrandSolid,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.middleDown,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  fabPosition: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  subButtons: {
    position: 'absolute',
    bottom: 44 + gap.M,
    alignItems: 'center',
    gap: gap.M,
  },
  sub: {
    alignSelf: 'center',
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
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.M,
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: colors.bgLayerDefault,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.middleDown,
  },
});
