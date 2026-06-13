import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IcHamburger from '../../assets/icons/ic_hamburger.svg';
import IcStamp from '../../assets/icons/ic_stamp.svg';
import IcHome from '../../assets/icons/ic_home.svg';
import IcLetter from '../../assets/icons/ic_letter.svg';
import { STAMPS, TEMPLATES, resolvePatternColor } from '../write/letter/data/letterCoverData';

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

const NEW_LETTERS = TEMPLATES.slice(0, 3).map((t, i) => {
  const resolved = resolvePatternColor(t.patternColorId);
  const color = resolved?.color;
  const stamp = STAMPS.find(s => s.id === t.stampId);
  return { id: i + 1, frontImg: color?.frontImg, flapImg: color?.flapImg, stamp };
});

const SAMPLE_GROUPS = [
  { date: '25/11', letters: [{ id: 1 }] },
  { date: '25/10', letters: [{ id: 1 }, { id: 2 }] },
  { date: '25/09', letters: [{ id: 1 }, { id: 2 }, { id: 3 }] },
  { date: '25/08', letters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }] },
  { date: '25/05', letters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] },
];

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 + gap.XL + padding.XXL }}
      >
        <StrokeTabBar tabs={STROKE_TABS} defaultKey="all" />
        <View style={styles.filterRow}>
          <Filter label="최신순" />
          <TapButton tabs={TAP_TABS} defaultKey="list" />
        </View>
        <NewLetterRow letters={NEW_LETTERS} />
        <View style={styles.listContent}>
          {SAMPLE_GROUPS.map((group) => (
            <LetterListRow key={group.date} date={group.date} letters={group.letters} />
          ))}
        </View>
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
