// 유경 생성

import { View, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import TabBar from '../../../shared/components/TabBar';
import ButtonIcon from '../../../shared/components/ButtonIcon';
import Templete from './components/Templete';

import FlipIcon from '../../../assets/icons/ic_flip.svg';

import UseLetterCoverSelect, { TABS, MOCK_DATA } from './hook/UseLetterCoverSelect';

import { colors } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 3열 아이템 너비: 화면 - 좌우 패딩(16*2) - 간격(8*2)
const ITEM_3COL = (SCREEN_WIDTH - padding.XL * 2 - gap.M * 2) / 3;

const TAB_COLUMNS = { template: 2, pattern: 3, color: 3, stamp: 3 };

function PatternItem({ selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item3Col, { aspectRatio: 1 }, selected && styles.itemSelected]}
    />
  );
}

function ColorItem({ color, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.item3Col, { aspectRatio: 1, backgroundColor: color }, selected && styles.itemSelected]}
    />
  );
}

function StampItem({ selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      // 피그마 기준 109×145 → 3:4 비율
      style={[styles.item3Col, { aspectRatio: 3 / 4 }, selected && styles.itemSelected]}
    />
  );
}

export default function LetterCoverSelect({ navigation }) {
  const {
    activeTab,
    selectedItems,
    handleTabPress,
    handleSelectItem,
    handleFlip,
    isNextEnabled,
  } = UseLetterCoverSelect();

  const currentData = MOCK_DATA[activeTab];
  const numColumns = TAB_COLUMNS[activeTab];

  // 데이터를 numColumns 단위로 행 분리
  const rows = [];
  for (let i = 0; i < currentData.length; i += numColumns) {
    rows.push(currentData.slice(i, i + numColumns));
  }

  const renderItem = (item) => {
    const selected = selectedItems[activeTab] === item.id;
    const onPress = () => handleSelectItem(item.id);

    switch (activeTab) {
      case 'template':
        return <Templete key={item.id} label={item.label} selected={selected} onPress={onPress} />;
      case 'pattern':
        return <PatternItem key={item.id} selected={selected} onPress={onPress} />;
      case 'color':
        return <ColorItem key={item.id} color={item.value} selected={selected} onPress={onPress} />;
      case 'stamp':
        return <StampItem key={item.id} selected={selected} onPress={onPress} />;
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

      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* 봉투 미리보기 — Rive 애니메이션 자리 */}
        <View style={styles.sectionLetter}>
          <View style={styles.riveContainer} />
          <ButtonIcon
            Icon={FlipIcon}
            size="L"
            variant="none"
            onPress={handleFlip}
            style={styles.flipButton}
          />
        </View>

        <TabBar tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

        {/* 탭별 선택 그리드 */}
        <View style={[
          styles.section,
          activeTab === 'template' ? styles.sectionTemplate : styles.section3Col,
        ]}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map(item => renderItem(item))}
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
    flexGrow: 1,
  },

  // 봉투 미리보기
  sectionLetter: {
    width: '100%',
    alignItems: 'center',
    paddingTop: padding.XL,
    paddingBottom: 32,
  },
  riveContainer: {
    width: 280,
    height: 210,
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
