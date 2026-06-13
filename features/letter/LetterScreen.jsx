import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IcHamburger from '../../assets/icons/ic_hamburger.svg';
import IcStamp from '../../assets/icons/ic_stamp.svg';
import IcHome from '../../assets/icons/ic_home.svg';
import IcLetter from '../../assets/icons/ic_letter.svg';
import { PATTERNS, STAMPS } from '../write/letter/data/letterCoverData';

import TopNavigation from '../../shared/components/TopNavigation';
import LetterListRow from './components/LetterListRow';
import NewLetterRow from './components/NewLetterRow';
import StrokeTabBar from '../../shared/components/StrokeTabBar';
import Filter from '../../shared/components/Filter';
import TapButton from '../../shared/components/TapButton';
import BottomNavigation from '../../shared/components/BottomNavigation';
import FAB from '../../shared/components/FAB';

import { colors } from '../../shared/styles/color';
import { gap, padding } from '../../shared/styles/token';

const PROFILE_SOURCE = require('../../assets/write/profile_img.png');

const NEW_LETTERS = [
  { id: 1, frontImg: PATTERNS[0].colors[0].frontImg, stampImage: STAMPS[0].image },
  { id: 2, frontImg: PATTERNS[2].colors[1].frontImg, stampImage: STAMPS[4].image },
  { id: 3, frontImg: PATTERNS[4].colors[4].frontImg, stampImage: STAMPS[9].image },
];

const SAMPLE_GROUPS = [
  { date: '25/11', letters: [{ id: 1 }] },
  { date: '25/10', letters: [{ id: 1 }, { id: 2 }] },
  { date: '25/09', letters: [{ id: 1 }, { id: 2 }, { id: 3 }] },
  { date: '25/08', letters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }] },
  { date: '25/05', letters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] },
];

const STROKE_TABS = [
  { key: 'all',      label: '전체 편지' },
  { key: 'received', label: '받은 편지' },
  { key: 'tome',     label: '나에게 편지' },
  { key: 'sent',     label: '보낸 편지' },
];

const TAP_TABS = [
  { key: 'list',  icon: <IcHamburger /> },
  { key: 'stamp', icon: <IcStamp /> },
];

export default function LetterScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const NAV_ITEMS = [
    { type: 'icon', Icon: IcHome, isActive: false, onPress: () => navigation.navigate('Main', { screen: 'FeedHome' }) },
    { type: 'icon', Icon: IcLetter, isActive: true },
    { type: 'profile', profileSource: PROFILE_SOURCE, isActive: false },
  ];

  return (
    <View style={styles.screen}>
      <TopNavigation usage="depth1" />

      <StrokeTabBar tabs={STROKE_TABS} defaultKey="all" />

      <View style={styles.filterRow}>
        <Filter label="최신순" />
        <TapButton tabs={TAP_TABS} defaultKey="list" />
      </View>

      <NewLetterRow letters={NEW_LETTERS} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 48 + gap.XL + padding.XXL },
        ]}
      >
        {SAMPLE_GROUPS.map((group) => (
          <LetterListRow key={group.date} date={group.date} letters={group.letters} />
        ))}
      </ScrollView>

      <View style={[styles.bottomArea, { bottom: insets.bottom + padding.XXL }]}>
        <BottomNavigation items={NAV_ITEMS} />
        <FAB />
      </View>
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
    padding: padding.XL,
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
