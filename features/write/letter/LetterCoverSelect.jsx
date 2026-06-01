// 유경 생성

import { View, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import TabBar from '../../../shared/components/TabBar';
import ButtonIcon from '../../../shared/components/ButtonIcon';
import Templete from './components/Templete';
import LetterFlip from './components/LetterFlip';
import PatternItem from '../components/PatternItem';
import ColorItem from '../components/ColorItem';
import StampItem from '../components/StampItem';

import FlipIcon from '../../../assets/icons/ic_flip.svg';

import UseLetterCoverSelect, { TABS } from './hook/UseLetterCoverSelect';
import { PATTERNS, STAMPS, TEMPLATES } from './data/letterCoverData';

import { colors } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 3열 아이템 너비: 화면 - 좌우 패딩(16*2) - 간격(8*2)
const ITEM_3COL = (SCREEN_WIDTH - padding.XL * 2 - gap.M * 2) / 3;

const TAB_COLUMNS = { template: 2, pattern: 3, color: 3, stamp: 3 };




export default function LetterCoverSelect({ navigation }) {
  const {
    activeTab,
    selectedItems,
    currentColors,
    isFront,
    handleTabPress,
    handleSelectItem,
    handleFlip,
    isNextEnabled,
  } = UseLetterCoverSelect();

  // 탭별 데이터
  const TAB_DATA = {
    template: TEMPLATES,
    pattern:  PATTERNS,
    color:    currentColors,
    stamp:    STAMPS,
  };
  const currentData = TAB_DATA[activeTab];
  const numColumns  = TAB_COLUMNS[activeTab];

  // 데이터를 numColumns 단위로 행 분리
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

      {/* 봉투 미리보기 — 고정 */}
      <View style={styles.sectionLetter}>
        <LetterFlip isFront={isFront} />
        <ButtonIcon
          Icon={FlipIcon}
          size="L"
          variant="none"
          onPress={handleFlip}
          style={styles.flipButton}
        />
      </View>

      {/* 탭바 — 고정 */}
      <TabBar tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

      {/* 탭별 선택 그리드 — 스크롤 */}
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
  flipButton: {
    position: 'absolute',
    top: 12,
    right: 0,
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
