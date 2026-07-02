import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TopNavigation from '../../../shared/components/TopNavigation';
import Music from '../../../shared/components/music/Music';
import Profile from '../../../shared/components/Profile';
import ButtonIcon from '../../../shared/components/ButtonIcon';
import BottomBar from '../components/BottomBar';
import Img from '../components/Img';

import BookmarkStroke from '../../../assets/icons/ic_bookmark_stroke.svg';
import HeartStroke from '../../../assets/icons/ic_heart_stroke.svg';
import XIcon from '../../../assets/icons/ic_x.svg';
import FoldCorner from '../../../assets/write/graphic_paper.svg';

import { colors, palette } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';
import { formatDate } from '../../../shared/utils/formatDate';
import { useRecordFormStore } from '../record/store/useRecordFormStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// TopNavigation / BottomBar 높이 근사값 (RecordScreen과 동일한 화면 구성 기준)
const NAV_HEIGHT = 56;
const BOTTOM_BAR_HEIGHT = 40;

const POST_HEIGHT_WITH_IMAGE = 520;
const POST_HEIGHT_TEXT_ONLY = 517;

const WRITE_CARD_GAP = 16;
const FEED_CARD_GAP = gap.M;

const MAX_LINES = { withImage: 6, textOnly: 10 };

const HOLD_DURATION = 300;
const MORPH_DURATION = 700;
const NAV_HIDE_DURATION = 950;
const SETTLE_DURATION = 500;
const DISSOLVE_OUT_DURATION = 450;
const DISSOLVE_OUT_SCALE = 0.92;

const TOTAL_MORPH_DURATION = Math.max(MORPH_DURATION, NAV_HIDE_DURATION);

const EASE = Easing.inOut(Easing.cubic);
const EASE_OUT = Easing.out(Easing.cubic);

function TextLines({ content, maxLines }) {
  const [lines, setLines] = useState([]);
  const [measured, setMeasured] = useState(false);

  const onTextLayout = useCallback((e) => {
    if (!measured) {
      setLines(e.nativeEvent.lines);
      setMeasured(true);
    }
  }, [measured]);

  if (!content) return null;

  if (!measured) {
    return (
      <Text style={[styles.lineText, { opacity: 0 }]} onTextLayout={onTextLayout}>
        {content}
      </Text>
    );
  }

  return (
    <View style={styles.linesContainer}>
      {lines.slice(0, maxLines).map((line, i) => (
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

export default function FeedTransitionScreen({ navigation, route }) {
  const { text = '', images = [], music = null, userId = '1' } = route?.params ?? {};
  const recordForm = useRecordFormStore();
  const insets = useSafeAreaInsets();

  const hasImages = images.length > 0;
  const maxLines = hasImages ? MAX_LINES.withImage : MAX_LINES.textOnly;

  const fullCardHeight =
    SCREEN_HEIGHT - insets.top - insets.bottom - NAV_HEIGHT - BOTTOM_BAR_HEIGHT - padding.XL * 2;
  const compactCardHeight = hasImages ? POST_HEIGHT_WITH_IMAGE : POST_HEIGHT_TEXT_ONLY;

  const navOffset = NAV_HEIGHT + insets.top + padding.XL;
  const bottomBarOffset = BOTTOM_BAR_HEIGHT + insets.bottom + padding.XL;

  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1);

  const navTranslateY = useSharedValue(0);
  const navOpacity = useSharedValue(1);

  const bottomBarTranslateY = useSharedValue(0);
  const bottomBarOpacity = useSharedValue(1);

  const foldOpacity = useSharedValue(1);

  const cardHeight = useSharedValue(fullCardHeight);
  const cardGap = useSharedValue(WRITE_CARD_GAP);
  // 작성 화면 종이의 상/하 padding(4, 12)에서 피드 카드의 padding(8, 8)으로 전환
  const cardPaddingTop = useSharedValue(padding.S);
  const cardPaddingBottom = useSharedValue(padding.L);
  const bodyPaddingH = useSharedValue(padding.M);

  // Music에 재생 버튼 공간을 처음부터 예약해두면 작성 화면과 레이아웃이 달라져
  // 화면이 바뀌는 순간 텍스트가 즉시 리플로우된다. 애니메이션 중간에만 등장시킨다.
  const [showPlayButton, setShowPlayButton] = useState(false);
  const playButtonOpacity = useSharedValue(0);

  const imagesTranslateY = useSharedValue(20);
  const imagesOpacity = useSharedValue(0);

  const profileTranslateY = useSharedValue(12);
  const profileOpacity = useSharedValue(0);

  const otherFooterOpacity = useSharedValue(0);

  const goToFeed = () => {
    recordForm.resetForm();

    navigation.reset({
      index: 0,
      routes: [{ name: 'FeedHome' }],
    });
  };

  useEffect(() => {
    // TopNavigation, BottomBar — 위/아래로 천천히 밀려나며 서서히 사라짐 (ease-out으로 급격한 소멸감 방지)
    navTranslateY.value = withDelay(
      HOLD_DURATION,
      withTiming(-navOffset, { duration: NAV_HIDE_DURATION, easing: EASE_OUT })
    );
    navOpacity.value = withDelay(
      HOLD_DURATION,
      withTiming(0, { duration: NAV_HIDE_DURATION, easing: EASE_OUT })
    );

    bottomBarTranslateY.value = withDelay(
      HOLD_DURATION,
      withTiming(bottomBarOffset, { duration: NAV_HIDE_DURATION, easing: EASE_OUT })
    );
    bottomBarOpacity.value = withDelay(
      HOLD_DURATION,
      withTiming(0, { duration: NAV_HIDE_DURATION, easing: EASE_OUT })
    );

    foldOpacity.value = withDelay(
      HOLD_DURATION,
      withTiming(0, { duration: MORPH_DURATION, easing: EASE_OUT })
    );

    // 종이 자체는 페이드 없이 크기만 부드럽게 축소
    cardHeight.value = withDelay(
      HOLD_DURATION,
      withTiming(compactCardHeight, { duration: MORPH_DURATION, easing: EASE })
    );
    cardGap.value = withDelay(
      HOLD_DURATION,
      withTiming(FEED_CARD_GAP, { duration: MORPH_DURATION, easing: EASE })
    );
    cardPaddingTop.value = withDelay(
      HOLD_DURATION,
      withTiming(padding.S, { duration: MORPH_DURATION, easing: EASE })
    );
    cardPaddingBottom.value = withDelay(
      HOLD_DURATION,
      withTiming(padding.M, { duration: MORPH_DURATION, easing: EASE })
    );
    bodyPaddingH.value = withDelay(
      HOLD_DURATION,
      withTiming(padding.L, { duration: MORPH_DURATION, easing: EASE })
    );

    // Music 재생 버튼 — 레이아웃 예약 없이 있다가, 폴드/종이 축소와 동시에 트리에 넣고 페이드인
    const playButtonTimer = setTimeout(() => {
      setShowPlayButton(true);
    }, HOLD_DURATION);

    playButtonOpacity.value = withDelay(
      HOLD_DURATION,
      withTiming(1, { duration: MORPH_DURATION, easing: EASE_OUT })
    );

    // 이미지 — 아래에서 올라오며 페이드인
    if (hasImages) {
      imagesTranslateY.value = withDelay(
        HOLD_DURATION + MORPH_DURATION * 0.5,
        withTiming(0, { duration: MORPH_DURATION * 0.5, easing: EASE_OUT })
      );
      imagesOpacity.value = withDelay(
        HOLD_DURATION + MORPH_DURATION * 0.5,
        withTiming(1, { duration: MORPH_DURATION * 0.5, easing: EASE_OUT })
      );
    }

    // 프로필(container_profile) — 아래에서 올라오며 페이드인
    profileTranslateY.value = withDelay(
      HOLD_DURATION + MORPH_DURATION * 0.6,
      withTiming(0, { duration: MORPH_DURATION * 0.4, easing: EASE_OUT })
    );
    profileOpacity.value = withDelay(
      HOLD_DURATION + MORPH_DURATION * 0.6,
      withTiming(1, { duration: MORPH_DURATION * 0.4, easing: EASE_OUT })
    );

    // 날짜, 북마크/좋아요 — 페이드인
    otherFooterOpacity.value = withDelay(
      HOLD_DURATION + MORPH_DURATION * 0.7,
      withTiming(1, { duration: MORPH_DURATION * 0.3, easing: EASE_OUT })
    );

    // 정착 후 화면 전체가 살짝 작아지며 디졸브 — 편지 전송 인터랙션과 동일한 마무리 방식
    screenScale.value = withDelay(
      HOLD_DURATION + TOTAL_MORPH_DURATION + SETTLE_DURATION,
      withTiming(DISSOLVE_OUT_SCALE, { duration: DISSOLVE_OUT_DURATION, easing: EASE })
    );
    screenOpacity.value = withDelay(
      HOLD_DURATION + TOTAL_MORPH_DURATION + SETTLE_DURATION,
      withTiming(0, { duration: DISSOLVE_OUT_DURATION, easing: EASE }, (finished) => {
        if (finished) runOnJS(goToFeed)();
      })
    );

    return () => clearTimeout(playButtonTimer);
  }, []);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ scale: screenScale.value }],
  }));

  const navStyle = useAnimatedStyle(() => ({
    opacity: navOpacity.value,
    transform: [{ translateY: navTranslateY.value }],
  }));

  const bottomBarStyle = useAnimatedStyle(() => ({
    opacity: bottomBarOpacity.value,
    transform: [{ translateY: bottomBarTranslateY.value }],
  }));

  const foldStyle = useAnimatedStyle(() => ({ opacity: foldOpacity.value }));

  const cardStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
    gap: cardGap.value,
    paddingTop: cardPaddingTop.value,
    paddingBottom: cardPaddingBottom.value,
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    paddingHorizontal: bodyPaddingH.value,
  }));

  const playButtonStyle = useAnimatedStyle(() => ({ opacity: playButtonOpacity.value }));

  const imagesStyle = useAnimatedStyle(() => ({
    opacity: imagesOpacity.value,
    transform: [{ translateY: imagesTranslateY.value }],
  }));

  const profileStyle = useAnimatedStyle(() => ({
    opacity: profileOpacity.value,
    transform: [{ translateY: profileTranslateY.value }],
  }));

  const otherFooterStyle = useAnimatedStyle(() => ({ opacity: otherFooterOpacity.value }));

  return (
    <Animated.View style={[styles.screen, screenStyle]}>
      <Animated.View style={navStyle}>
        <TopNavigation
          title="피드 작성"
          buttonLabel="게시"
          type="brand"
          backIcon={XIcon}
        />
      </Animated.View>

      <View style={styles.container}>
        <View style={styles.sectionWrapper}>
          <Animated.View style={[styles.fold, foldStyle]}>
            <FoldCorner />
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            <Music
              title={music?.musicTitle}
              artist={music?.musicArtist}
              imageSource={music?.musicArtwork}
              empty={!music}
              button={showPlayButton}
              buttonStyle={playButtonStyle}
            />

            <Animated.View style={[styles.body, bodyStyle]}>
              <TextLines content={text} maxLines={maxLines} />

              {hasImages && (
                <Animated.View style={[styles.imageRow, imagesStyle]}>
                  {images.slice(0, 2).map((image, index) => (
                    <Img
                      key={`${image.uri}-${index}`}
                      variant="ImgOnly"
                      imageSource={{ uri: image.uri }}
                    />
                  ))}
                </Animated.View>
              )}
            </Animated.View>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Animated.View style={profileStyle}>
                  <Profile id={userId} type="id" />
                </Animated.View>
                <Animated.View style={otherFooterStyle}>
                  <Text style={styles.date}>{formatDate(new Date().toISOString())}</Text>
                </Animated.View>
              </View>

              <Animated.View style={[styles.footerRight, otherFooterStyle]}>
                <ButtonIcon
                  Icon={BookmarkStroke}
                  size="L"
                  variant="none"
                  iconColor={palette.gray[30]}
                />
                <ButtonIcon
                  Icon={HeartStroke}
                  size="L"
                  variant="none"
                  iconColor={palette.gray[30]}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </View>

      <Animated.View style={[styles.bottomBarWrapper, { bottom: insets.bottom }, bottomBarStyle]}>
        <BottomBar disabledImage />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgDefault,
  },

  container: {
    flex: 1,
    paddingVertical: padding.XL,
    paddingHorizontal: padding.M,
  },

  sectionWrapper: {
    flex: 1,
    position: 'relative',
  },

  fold: {
    position: 'absolute',
    top: -0.5,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },

  card: {
    width: '100%',
    backgroundColor: colors.bgLayerDefault,
    borderRadius: radius.M,
    overflow: 'hidden',
  },

  body: {
    flex: 1,
    alignSelf: 'stretch',
    gap: gap.M,
  },

  linesContainer: {
    alignSelf: 'stretch',
    gap: gap.M,
  },

  lineRow: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    gap: gap.XS,
  },

  lineText: {
    alignSelf: 'stretch',
    textAlign: 'justify',
    ...typo.bodyMedium,
    color: colors.fgLayerNeutral,
  },

  underline: {
    height: 1,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: colors.strokeNeutralWeak,
  },

  imageRow: {
    flexDirection: 'row',
    gap: gap.S,
    paddingVertical: padding.S,
  },

  footer: {
    position: 'absolute',
    bottom: padding.M,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: padding.S,
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  date: {
    ...typo.captionSmall,
    color: colors.fgNeutralWeak,
  },

  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },
});
