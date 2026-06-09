import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadow } from '../styles/color';
import { gap, padding, radius } from '../styles/token';
import { typo } from '../styles/typo';
import IcPlus from '../../assets/icons/ic_plus.svg';
import IcX from '../../assets/icons/ic_x.svg';
import IcLetter from '../../assets/icons/ic_letter.svg';
import IcPaper from '../../assets/icons/ic_paper.svg';

const ICON_SIZE = 18;

export default function FAB({ onPressFeed, onPressLetter }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* 서브 버튼 — 버튼 위에 absolute로 띄움 */}
      {open && (
        <View style={styles.subButtons}>
          <Pressable style={styles.sub} onPress={() => { setOpen(false); onPressFeed?.(); }}>
            <IcPaper width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
            <Text style={styles.subText}>피드 게시</Text>
          </Pressable>
          <Pressable style={styles.sub} onPress={() => { setOpen(false); onPressLetter?.(); }}>
            <IcLetter width={ICON_SIZE} height={ICON_SIZE} color={colors.fgNeutral} />
            <Text style={styles.subText}>편지 전송</Text>
          </Pressable>
        </View>
      )}

      {/* 항상 같은 자리 — + ↔ X */}
      <Pressable
        style={open ? styles.close : styles.main}
        onPress={() => setOpen(v => !v)}
      >
        <View style={open ? { transform: [{ rotate: '45deg' }] } : undefined}>
          <IcPlus
            width={open ? 25.46 : ICON_SIZE}
            height={open ? 25.46 : ICON_SIZE}
            color={open ? colors.fgLayerNeutralWeak : colors.fgNeutral}
          />
        </View>
      </Pressable>
    </View>
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

  wrapper: {
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
    overflow: 'hidden',
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
