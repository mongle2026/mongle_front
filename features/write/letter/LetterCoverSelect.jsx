// 유경 생성

import { View, ScrollView, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import TopNavigation from '../../../shared/components/TopNavigation';
import TabBar from '../../../shared/components/TabBar';
import Profile from '../../../shared/components/Profile';
import Templete from './components/Templete';
import PatternItem from '../components/PatternItem';
import ColorItem from '../components/ColorItem';
import StampItem from '../components/StampItem';

import UseLetterCoverSelect, { TABS } from './hook/UseLetterCoverSelect';
import { PATTERNS, STAMPS, TEMPLATES } from './data/letterCoverData';

import { colors, shadow } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 3열 아이템 너비: 화면 - 좌우 패딩(16*2) - 간격(8*2)
const ITEM_3COL = (SCREEN_WIDTH - padding.XL * 2 - gap.M * 2) / 3;

const TAB_COLUMNS = { template: 2, pattern: 3, color: 3, stamp: 3 };

// 봉투 미리보기 사이즈 (front SVG viewBox: 342.6 × 253.33)
const ENVELOPE_WIDTH  = SCREEN_WIDTH - padding.XL * 2;
const ENVELOPE_HEIGHT = ENVELOPE_WIDTH * (253.33 / 342.6);
// flap SVG viewBox: 325.17 × 173.2 — front와 동일한 픽셀-퍼-유닛 스케일로 렌더링
const FLAP_RENDER_WIDTH  = ENVELOPE_WIDTH * (325.17 / 342.6);
const FLAP_RENDER_HEIGHT = FLAP_RENDER_WIDTH * (173.2 / 325.17);
const FLAP_LEFT          = (ENVELOPE_WIDTH - FLAP_RENDER_WIDTH) / 2;
// back SVG clipPath 기준 봉투 shape 여백 (~15.8 가로, ~13.92 세로 SVG units)
const ENV_MARGIN_H = ENVELOPE_WIDTH * (15.8 / 342.6);
const ENV_MARGIN_V = ENVELOPE_WIDTH * (13.92 / 342.6);

export default function LetterCoverSelect({ navigation }) {
  const {
    activeTab,
    selectedItems,
    currentColors,
    handleTabPress,
    handleSelectItem,
    isNextEnabled,
  } = UseLetterCoverSelect();

  // 현재 선택된 color/stamp resolve
  const selectedPattern = PATTERNS.find(p => p.id === selectedItems.patternId);
  const selectedColor   = selectedPattern?.colors.find(c => c.id === selectedItems.colorId);
  const selectedStamp   = STAMPS.find(s => s.id === selectedItems.stampId);

  const FrontSvg = selectedColor?.frontImg?.default ?? selectedColor?.frontImg;
  const FlapSvg  = selectedColor?.flapImg?.default  ?? selectedColor?.flapImg;
  const backSrc  = selectedColor?.backImg ?? selectedColor?.frontImg;
  const BackSvg  = backSrc?.default ?? backSrc;

  // 플립 애니메이션 — 0: 앞면, 1: 뒷면
  const flipProgress = useSharedValue(0);

  const handleFlip = () => {
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

  // 탭별 데이터
  const TAB_DATA = {
    template: TEMPLATES,
    pattern:  PATTERNS,
    color:    currentColors,
    stamp:    STAMPS,
  };
  const currentData = TAB_DATA[activeTab];
  const numColumns  = TAB_COLUMNS[activeTab];

  const rows = [];
  for (let i = 0; i < currentData.length; i += numColumns) {
    rows.push(currentData.slice(i, i + numColumns));
  }

  const renderItem = (item) => {
    const onPress = () => handleSelectItem(item.id);

    switch (activeTab) {
      case 'template':
        return (
          <Templete
            key={item.id}
            label={item.label}
            imageSource={item.preview}
            isSelected={selectedItems.template === item.id}
            onPress={onPress}
          />
        );
      case 'pattern':
        return (
          <PatternItem
            key={item.id}
            thumbnail={item.thumbnail}
            isSelected={selectedItems.patternId === item.id}
            onPress={onPress}
          />
        );
      case 'color':
        return (
          <ColorItem
            key={item.id}
            color={item.color}
            isSelected={selectedItems.colorId === item.id}
            onPress={onPress}
          />
        );
      case 'stamp':
        return (
          <StampItem
            key={item.id}
            image={item.image}
            isSelected={selectedItems.stampId === item.id}
            onPress={onPress}
          />
        );
    }
  };

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="편지 봉투 선택"
        buttonLabel="다음"
        onPressBack={() => navigation.goBack()}
        onPressButton={() => {}}
        buttonDisabled={!isNextEnabled}
      />

      {/* 봉투 미리보기 */}
      <View style={styles.sectionLetter}>
        <Pressable
          onPress={handleFlip}
          style={styles.envelopeContainer}
        >
          {/* 앞면 */}
          <Animated.View style={[styles.envelopeFace, frontAnimStyle]}>
            {FrontSvg && <FrontSvg width={ENVELOPE_WIDTH} height={ENVELOPE_HEIGHT} />}
            {FlapSvg && (
              <View style={[styles.flapWrapper, { height: FLAP_RENDER_HEIGHT }]}>
                <FlapSvg width={FLAP_RENDER_WIDTH} height={FLAP_RENDER_HEIGHT} />
              </View>
            )}
            <Profile
              imageOnly
              style={styles.profileOverlay}
            />
          </Animated.View>

          {/* 뒷면 */}
          <Animated.View style={[styles.envelopeFace, styles.envelopeFaceBack, backAnimStyle]}>
            {BackSvg && <BackSvg width={ENVELOPE_WIDTH} height={ENVELOPE_HEIGHT} />}
            {selectedStamp && (
              <Image source={selectedStamp.image} style={styles.stamp} />
            )}
            <Profile
              imageOnly
              style={styles.profileOverlay}
            />
          </Animated.View>
        </Pressable>
      </View>

      {/* 탭바 */}
      <TabBar tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

      {/* 탭별 선택 그리드 */}
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <View style={[
          styles.section,
          activeTab === 'template' ? styles.sectionTemplate : styles.section3Col,
        ]}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map(item => renderItem(item))}
              {Array.from({ length: numColumns - row.length }).map((_, i) => (
                <View key={`spacer-${i}`} style={styles.rowSpacer} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgDefault,
  },
  scrollContent: {
    paddingBottom: padding.XL,
  },

  // 봉투 미리보기
  sectionLetter: {
    width: '100%',
    alignItems: 'center',
    paddingTop: padding.XL,
    paddingBottom: 32,
  },
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
    top: 8,
    left: FLAP_LEFT,
    width: FLAP_RENDER_WIDTH,
    ...shadow.middleDown,
  },
  stamp: {
    position: 'absolute',
    top: ENV_MARGIN_V + 16,
    right: ENV_MARGIN_H + 16,
    width: 72,
    height: 106,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: ENV_MARGIN_V + 8,
    right: ENV_MARGIN_H + 8,
    width: 50,
  },

  // 그리드 공통
  section: {
    gap: gap.M,
    paddingVertical: padding.XL,
  },
  sectionTemplate: {
    paddingHorizontal: padding.M,
  },
  section3Col: {
    paddingHorizontal: padding.XL,
  },
  rowSpacer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: gap.M,
  },

  // 3열 아이템 공통
  item3Col: {
    width: ITEM_3COL,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.XS,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: colors.fgBrand,
  },
});
