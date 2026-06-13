// 유경 생성

import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import axios from 'axios';

import TopNavigation from '../../../shared/components/TopNavigation';
import TabBar from '../../../shared/components/TabBar';
import EnvelopePreview from '../../../shared/components/EnvelopePreview';
import Templete from './components/Templete';
import PatternItem from '../components/PatternItem';
import ColorItem from '../components/ColorItem';
import StampItem from '../components/StampItem';

import UseLetterCoverSelect, { TABS } from './hook/UseLetterCoverSelect';
import { PATTERNS, STAMPS, TEMPLATES, resolvePatternColor, useLetterCoverStore } from './data/letterCoverData';

import { colors } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';
import { useRecordFormStore } from '../record/store/useRecordFormStore';
import { createRecordFormData } from '../utils/createRecordFormData ';

const API_BASE_URL = 'http://192.168.0.3:3000';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 3열 아이템 너비: 화면 - 좌우 패딩(16*2) - 간격(8*2)
const ITEM_3COL = (SCREEN_WIDTH - padding.XL * 2 - gap.M * 2) / 3;

const TAB_COLUMNS = { template: 2, pattern: 3, color: 3, stamp: 3 };

export default function LetterCoverSelect({ navigation }) {
  const {
    activeTab,
    selectedItems,
    currentColors,
    handleTabPress: _handleTabPress,
    handleSelectItem,
    isNextEnabled,
  } = UseLetterCoverSelect();

  const { setEnvelope } = useLetterCoverStore();
  const { patternId, colorId, stampId } = useLetterCoverStore();

  // 플립 애니메이션 — 0: 앞면, 1: 뒷면
  const flipProgress = useSharedValue(0);

  const handleTabPress = (key) => {
    if (key === 'stamp' && flipProgress.value === 0) {
      flipProgress.value = withTiming(1, { duration: 500 });
    }
    _handleTabPress(key);
  };

  // 현재 선택된 color/stamp resolve
  const selectedPattern = PATTERNS.find(p => p.id === selectedItems.patternId);
  const selectedColor = selectedPattern?.colors.find(c => c.id === selectedItems.colorId);
  const selectedStamp = STAMPS.find(s => s.id === selectedItems.stampId);

  const FrontSvg = selectedColor?.frontImg?.default ?? selectedColor?.frontImg;
  const FlapSvg = selectedColor?.flapImg?.default ?? selectedColor?.flapImg;
  const backSrc = selectedColor?.backImg ?? selectedColor?.frontImg;
  const BackSvg = backSrc?.default ?? backSrc;

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
    pattern: PATTERNS,
    color: currentColors,
    stamp: STAMPS,
  };
  const currentData = TAB_DATA[activeTab];
  const numColumns = TAB_COLUMNS[activeTab];

  const rows = [];
  for (let i = 0; i < currentData.length; i += numColumns) {
    rows.push(currentData.slice(i, i + numColumns));
  }

  const renderItem = (item) => {
    const onPress = () => handleSelectItem(item.id);

    switch (activeTab) {
      case 'template': {
        const resolved = resolvePatternColor(item.patternColorId);
        const PatternSvg = resolved?.color?.frontImg?.default ?? resolved?.color?.frontImg;
        const colorHex = resolved?.color?.color;
        const stamp = STAMPS.find(s => s.id === item.stampId);
        return (
          <Templete
            key={item.id}
            label={item.label}
            PatternSvg={PatternSvg}
            color={colorHex}
            stampImage={stamp?.image}
            isSelected={selectedItems.template === item.id}
            onPress={onPress}
          />
        );
      }
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

  const recordForm = useRecordFormStore();
  const receiver = useRecordFormStore(state => state.receiver.id);
  // 임시 하드코딩
  const userId = '1';
  const recordType = "LETTER";

  const handleCommit = async () => {
    try {
      console.log('handleCommit 실행됨');
      console.log('userId:', userId);
      console.log('receiver:', receiver);
      console.log('recordForm:', recordForm);
      console.log('recordType:', recordType);
      console.log('letterCover:', { patternId, colorId, stampId });

      if (userId === receiver) {
        console.log('나에게 보내기 - SelectDate 이동');
        navigation.navigate('SelectDate');
        return;
      }

      const formData = createRecordFormData({
        userId,
        recordForm,
        recordType,
        letterCover: {
          patternId,
          colorId,
          stampId,
        },
      });

      console.log('저장되는 값', formData);

      const response = await axios.post(
        `${API_BASE_URL}/letter`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: data => data,
        }
      );

      console.log('요청 성공:', response.data);
      navigation.navigate('SendAnimation', {
        toMe: false,
      });


      // recordForm.resetForm();

      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Main' }],
      // });

    } catch (error) {
      console.log('handleCommit 전체 에러:', error);

      if (error.response) {
        console.log('요청 실패 상태:', error.response.status);
        console.log('요청 실패 데이터:', error.response.data);
        console.log('요청 실패 헤더:', error.response.headers);
      } else if (error.request) {
        console.log('응답 없음:', error.request);
      } else {
        console.log('요청 설정 또는 프론트 코드 오류:', error.message);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="편지 봉투 선택"
        buttonLabel={userId === receiver ? '다음' : '전송'}
        onPressBack={() => navigation.goBack()}
        onPressButton={handleCommit}
        buttonDisabled={!isNextEnabled}
      />

      {/* 봉투 미리보기 */}
      <View style={styles.sectionLetter}>
        <EnvelopePreview
          FrontSvg={FrontSvg}
          FlapSvg={FlapSvg}
          BackSvg={BackSvg}
          selectedStamp={selectedStamp}
          frontAnimStyle={frontAnimStyle}
          backAnimStyle={backAnimStyle}
          onPress={handleFlip}
        />
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
    paddingTop: padding.M,
    paddingBottom: padding.XL,
  },

  // 그리드 공통
  section: {
    gap: gap.M,
    paddingVertical: padding.XL,
  },
  sectionTemplate: {
    paddingHorizontal: padding.XL,
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
