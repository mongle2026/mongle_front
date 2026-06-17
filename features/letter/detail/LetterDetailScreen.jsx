import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import GraphicPaper from '../../../assets/write/graphic_paper.svg';
import Music from '../../../shared/components/Music';
import Profile from '../../../shared/components/Profile';
import Button from '../../../shared/components/Button';
import { colors } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 피그마 기준 (375×812) 비율로 스케일
const SCALE = SCREEN_HEIGHT / 812;
const CARD_TOP = Math.round(74 * SCALE);
const CARD_H_MARGIN = padding.XL;
const CARD_WIDTH = SCREEN_WIDTH - CARD_H_MARGIN * 2;
const CARD_HEIGHT = 602;

// 장식 블록: 카드 내부 기준 offset으로 계산 (피그마 top:336-74=262, h:404)
const DECO_LEFT = 8;
const DECO_OFFSET_FROM_CARD = Math.round(262 * SCALE);  // 카드 top 기준 상대 위치
const DECO_WIDTH = SCREEN_WIDTH - DECO_LEFT * 2;
const DECO_HEIGHT = Math.round(404 * SCALE);

function TextLines({ content = '' }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  const onTextLayout = useCallback(
    (e) => {
      if (!measured) {
        setLines(e.nativeEvent.lines);
        setMeasured(true);
      }
    },
    [measured],
  );

  if (!measured) {
    return (
      <Text style={[styles.lineText, { opacity: 0 }]} onTextLayout={onTextLayout}>
        {content}
      </Text>
    );
  }

  return (
    <View style={styles.linesContainer}>
      {lines.map((line, i) => (
        <View key={i} style={styles.lineRow}>
          <Text style={styles.lineText} numberOfLines={1}>
            {line.text.trimEnd()}
          </Text>
          <View style={styles.underline} />
        </View>
      ))}
    </View>
  );
}

export default function LetterDetailModal({
  visible = false,
  onClose,
  content = '',
  senderName = '이름',
  senderImage,
  musicTitle = '음악 선택',
  musicArtist = 'Honne',
  musicCover,
  musicUri,
  onPressReply,
}) {
  const insets = useSafeAreaInsets();

  const CLOSE_BTN_HEIGHT = 40;
  const closeBottom = insets.bottom + padding.XL;
  const cardBottom = closeBottom + CLOSE_BTN_HEIGHT + 32;
  const cardTop = SCREEN_HEIGHT - cardBottom - CARD_HEIGHT;
  const decoTop = cardTop + DECO_OFFSET_FROM_CARD;

  const [internalVisible, setInternalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      slideAnim.setValue(SCREEN_HEIGHT);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setInternalVisible(false);
      onClose?.();
    });
  };

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* 딤 */}
        <View style={[StyleSheet.absoluteFill, styles.dim]} />

        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {/* 장식 블록 (#141433) — 카드 하단부 뒤, 화면 양옆 꽉 채움 */}
          <View style={[styles.decoBlock, { top: decoTop, height: DECO_HEIGHT }]} />

          {/* 편지지 카드 */}
          <View style={[styles.paper, { top: cardTop, height: CARD_HEIGHT }]}>
          {/* 종이 접힌 그래픽 — 우측 상단 */}
          <View style={styles.paperGraphic} pointerEvents="none">
            <GraphicPaper width={30} height={24} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 음악 (파형 없는 Music 컴포넌트) */}
            <Music
              title={musicTitle}
              artist={musicArtist}
              imageSource={musicCover}
              audioUri={musicUri}
              button
            />

            {/* 본문 텍스트 */}
            <View style={styles.textArea}>
              <TextLines content={content} />
            </View>

          </ScrollView>

          {/* 푸터: 발신자 + 답장하기 */}
          <View style={styles.footer}>
            <Profile name={senderName} tailText="에게서" imageSource={senderImage} />
            <Button label="답장하기" color="layerWeak" onPress={onPressReply} />
          </View>
        </View>

          {/* 편지 닫기 버튼 */}
          <View style={[styles.closeBar, { top: cardTop + CARD_HEIGHT + 32 }]}>
            <Button
              label="편지 닫기"
              color="brand"
              onPress={handleClose}
              style={styles.closeButton}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  dim: {
    backgroundColor: 'rgba(26,27,28,0.75)',
  },
  decoBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#141433',
  },
  paper: {
    position: 'absolute',
    left: CARD_H_MARGIN,
    width: CARD_WIDTH,
    backgroundColor: colors.bgLayerDefault,
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
  paperGraphic: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: padding.M,
  },
  textArea: {
    paddingHorizontal: padding.L,
    paddingVertical: gap.M,
  },
  linesContainer: {
    gap: gap.M,
  },
  lineRow: {
    gap: gap.XS,
  },
  lineText: {
    ...typo.bodyMedium,
    color: colors.fgLayerNeutral,
  },
  underline: {
    height: 1,
    backgroundColor: colors.bgLayerWeak,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: gap.S,
    paddingHorizontal: padding.L,
    paddingVertical: padding.S,
  },
  attachedImage: {
    width: 160,
    height: 160,
    borderRadius: radius.XS,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: padding.S,
    paddingRight: padding.L,
    paddingVertical: padding.M,
    borderTopWidth: 0,
  },
  closeBar: {
    position: 'absolute',
    left: CARD_H_MARGIN,
    right: CARD_H_MARGIN,
  },

  closeButton: {
    width: '100%',
  },
});
