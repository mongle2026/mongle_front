import { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IcHamburger from '../../../assets/icons/ic_hamburger.svg';
import IcStamp from '../../../assets/icons/ic_stamp.svg';
import IcHome from '../../../assets/icons/ic_home.svg';
import IcLetter from '../../../assets/icons/ic_letter.svg';

import TopNavigation from '../../../shared/components/TopNavigation';
import LetterListRow from './components/LetterListRow';
import NewLetterRow from './components/NewLetterRow';
import StrokeTabBar from '../../../shared/components/StrokeTabBar';
import Filter from '../../../shared/components/Filter';
import TapButton from '../../../shared/components/TapButton';
import BottomNavigation from '../../../shared/components/BottomNavigation';
import FAB from '../../../shared/components/FAB';
import LetterDetailModal from '../detail/LetterDetailScreen';

import { colors } from '../../../shared/styles/color';
import { gap, padding } from '../../../shared/styles/token';

// TODO(API): GET /letter/new
// 상단 캐러셀에 표시할 최근 수신 편지 목록 (최대 3개)
// 응답 형태: Array<{
//   id: number,
//   patternColorId: string,   // 봉투 패턴+색상 식별자 (예: 'p2_c3')
//   stampId: string,          // 우표 식별자 (예: 's1')
//   senderName: string,
//   senderProfileImageUrl: string | null,
//   content: string,
//   musicTitle: string,
//   musicArtist: string,
//   musicCover: string | null,  // 앨범 커버 이미지 URL
//   musicUri: string | null,    // 재생 가능한 오디오 URL
// }>
const newLetters = [];

// TODO(API): GET /letter?filter=all|received|tome|sent&sort=latest
// 월별로 그룹핑된 편지 목록
// 응답 형태: Array<{
//   date: string,   // 'YY/MM' 형식
//   letters: Array<{
//     id: number,
//     patternColorId: string,
//     stampId: string,
//     senderName: string,
//     senderProfileImageUrl: string | null,
//     content: string,
//     musicTitle: string,
//     musicArtist: string,
//     musicCover: string | null,
//     musicUri: string | null,
//   }>
// }>
const letterGroups = [];

const PROFILE_SOURCE = require('../../../assets/write/profile_img.png');
const BOTTOM_NAV_HEIGHT = 48;

const STROKE_TABS = [
  { key: 'all',      label: '전체' },
  { key: 'received', label: '받은 편지' },
  { key: 'tome',     label: '나에게' },
  { key: 'sent',     label: '보낸 편지' },
];

const TAP_TABS = [
  { key: 'list',  icon: <IcHamburger /> },
  { key: 'stamp', icon: <IcStamp /> },
];

export default function LetterHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedLetter, setSelectedLetter] = useState(null);

  const NAV_ITEMS = useMemo(() => [
    { type: 'icon', Icon: IcHome, isActive: false, onPress: () => navigation.navigate('Main', { screen: 'FeedHome' }) },
    { type: 'icon', Icon: IcLetter, isActive: true },
    { type: 'profile', profileSource: PROFILE_SOURCE, isActive: false },
  ], [navigation]);

  const scrollContentStyle = useMemo(() => ({
    paddingBottom: insets.bottom + BOTTOM_NAV_HEIGHT + gap.XL + padding.XXL,
  }), [insets.bottom]);

  const handleCloseModal = useCallback(() => setSelectedLetter(null), []);

  return (
    <View style={styles.screen}>
      <TopNavigation usage="depth1" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={scrollContentStyle}
      >
        <StrokeTabBar tabs={STROKE_TABS} defaultKey="all" />
        <View style={styles.filterRow}>
          <Filter label="최신순" />
          <TapButton tabs={TAP_TABS} defaultKey="list" />
        </View>
        <NewLetterRow letters={newLetters} onPresLetter={setSelectedLetter} />
        <View style={styles.listContent}>
          {letterGroups.map((group) => (
            <LetterListRow key={group.date} date={group.date} letters={group.letters} onPressLetter={setSelectedLetter} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomArea, { bottom: insets.bottom + padding.XXL }]}>
        <BottomNavigation items={NAV_ITEMS} />
        <FAB />
      </View>

      <LetterDetailModal
        visible={selectedLetter !== null}
        onClose={handleCloseModal}
        {...(selectedLetter ?? {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgDefault,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: padding.M,
    paddingRight: padding.XL,
    paddingVertical: padding.M,
    height: 56,
  },
  scroll: {
    flex: 1,
  },
  listContent: {
    gap: gap.XL,
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: gap.XL,
  },
});
