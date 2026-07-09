// React
import React, { useEffect, useState } from 'react'
import { ScrollView, View, StyleSheet, Keyboard, BackHandler, Dimensions } from 'react-native'

// 서드파티
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

// 스토어 / 훅 / 유틸
import { useRecordFormStore } from '../record/store/useRecordFormStore.js';
import { createRecordFormData } from '../utils/createRecordFormData .js';
import { usePickImages } from './hook/usePickImages.js';
import { useToast } from './hook/useToast.js';
import { useFloatingBottomOffset } from './hook/useFloatingBottomOffset.js';

// 공통 컴포넌트
import TopNavigation from '../../../shared/components/TopNavigation.jsx';
import Music from '../../../shared/components/music/Music';
import Profile from '../../../shared/components/Profile.jsx';
import Toast from '../../../shared/components/Toast.jsx';
import Dialog from '../../../shared/components/Dialog.jsx';

// 피처 컴포넌트
import RecordText from '../record/components/RecordText.jsx';
import RecordImage from '../record/components/RecordImage.jsx';
import RecordAudio from '../record/components/RecordAudio.jsx';
import BottomBar from '../components/BottomBar.jsx';
import SelectRecipient from '../recipient/SelectRecipientScreen.jsx';
import SelectMusic from '../music/SelectMusic.jsx';


// 스타일
import { padding, radius } from '../../../shared/styles/token';
import { colors } from '../../../shared/styles/color';

// 에셋
import XIcon from '../../../assets/icons/ic_x.svg';
import FoldCorner from '../../../assets/write/graphic_paper.svg';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const BOTTOM_BAR_HEIGHT = 40;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 편지 전송 인터랙션(SendAnimationScreen)의 FLY_OUT_DURATION과 동일 — 이동+페이드가 동시에 일어나는 구간 기준
const POST_RISE_DURATION = 600;
const POST_RISE_DISTANCE = SCREEN_HEIGHT * 0.3;
const POST_RISE_SCALE = 0.92;

const RecordScreen = ({ navigation }) => {
  const recordForm = useRecordFormStore();
  const recordType = useRecordFormStore(state => state.recordType);
  // const recordType = "LETTER";
  // 나
  const userId = '1';

  const pickImages = usePickImages();
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);

  const { toast, showToast, pressToastAction } = useToast();
  const bottomValue = useFloatingBottomOffset();
  const insets = useSafeAreaInsets();

  const [disabled, setDisabled] = useState('disabled');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const navOpacity = useSharedValue(1);
  const bottomBarOpacity = useSharedValue(1);
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);
  const contentScale = useSharedValue(1);

  const navAnimatedStyle = useAnimatedStyle(() => ({
    opacity: navOpacity.value,
  }));

  const bottomBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bottomBarOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateY: contentTranslateY.value },
      { scale: contentScale.value },
    ],
  }));

  const isFormEmpty =
    recordForm.music === null &&
    recordForm.text === '' &&
    recordForm.files.length === 0 &&
    (recordType !== 'LETTER' || recordForm.receiver === null);

  useEffect(() => {
    if (recordType === 'LETTER') {
      if (recordForm.receiver !== null && recordForm.music !== null) {
        setDisabled('brand');
      }
    } else {
      if (recordForm.music !== null) {
        setDisabled('brand');
      }
    }

  }, [recordForm.receiver, recordForm.music]);

  const onPressBack = () => {
    Keyboard.dismiss();

    if (isFormEmpty) {
      navigation.goBack();
      return;
    }

    setIsDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setIsDialogVisible(false);
  };

  const handleConfirmBack = () => {
    setIsDialogVisible(false);
    recordForm.resetForm();
    navigation.reset({
      index: 0,
      routes: [{ name: 'FeedHome' }],
    });
  };

  useEffect(() => {
    const backAction = () => {
      if (isPosting) {
        return true;
      }

      if (isDialogVisible) {
        handleCloseDialog();
        return true;
      }

      onPressBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isDialogVisible, isFormEmpty, isPosting]);

  const goToFeedHome = () => {
    recordForm.resetForm();

    navigation.reset({
      index: 0,
      routes: [{
        name: 'FeedHome',
        params: {
          homeToast: {
            id: Date.now(),
            type: 'success',
            message: '기록이 피드에 게시됐어요.',
          },
        },
      }],
    });
  };

  const playPostAnimation = () => {
    navOpacity.value = withTiming(0, { duration: POST_RISE_DURATION });
    bottomBarOpacity.value = withTiming(0, { duration: POST_RISE_DURATION });
    contentOpacity.value = withTiming(0, { duration: POST_RISE_DURATION });
    contentScale.value = withTiming(POST_RISE_SCALE, { duration: POST_RISE_DURATION });
    contentTranslateY.value = withTiming(
      -POST_RISE_DISTANCE,
      { duration: POST_RISE_DURATION },
      (finished) => {
        if (finished) runOnJS(goToFeedHome)();
      }
    );
  };

  const handleCommit = async () => {
    if (recordType === 'LETTER' && recordForm.receiver === null) {
      showToast({
        message: '수신인을 지정해 주세요.',
        type: 'warning',
        duration: 2000,
        color: colors.fgCritical,
      });
      return;
    }

    if (recordForm.music === null) {
      showToast({
        message: '음악을 선택해 주세요.',
        type: 'warning',
        duration: 2000,
        color: colors.fgCritical,
      });
      return;
    }

    if (recordForm.text === '' && recordForm.files.length === 0) {
      showToast({
        message: '메시지를 작성하거나 사진을 첨부해 주세요.',
        type: 'warning',
        duration: 2000,
        color: colors.fgCritical,
      });
      return;
    };

    if (recordType === "FEED") {
      if (isPosting) {
        return;
      }

      const formData = createRecordFormData({
        userId,
        recordForm,
        recordType
      });

      setIsPosting(true);

      // =========== 전송 ============
      try {
        const response = await axios.post(
          `${API_BASE_URL}/feed`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data) => data,
          }
        );

        console.log('요청 성공:', response.data);
        playPostAnimation();
      } catch (error) {
        console.log('요청 실패 전체 error:', error);

        if (error.response) {
          // 백엔드가 응답은 했는데 400, 500 같은 에러 상태를 준 경우
          console.log('요청 실패 상태:', error.response.status);
          console.log('요청 실패 데이터:', error.response.data);
          console.log('요청 실패 헤더:', error.response.headers);
        } else if (error.request) {
          // 요청은 보냈는데 백엔드 응답을 아예 못 받은 경우
          console.log('응답 없음:', error.request);
        } else {
          // 요청 만들기 전에 프론트 코드에서 터진 경우
          console.log('요청 설정 오류:', error.message);
        }

        setIsPosting(false);
        showToast({
          message: '게시에 실패했어요. 다시 시도해 주세요.',
          type: 'warning',
          duration: 2000,
          color: colors.fgCritical,
        });
      }
    } else if (recordType === "LETTER") {
      navigation.navigate('LetterCoverSelect');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SelectRecipient
        visible={recipientOpen}
        onClose={() => setRecipientOpen(false)}
      />
      <SelectMusic
        visible={musicOpen}
        onClose={() => setMusicOpen(false)}
        searchPlaceholder="함께 보낼 음악을 검색해 주세요."
      />
      <Animated.View style={navAnimatedStyle}>
        {recordType === "LETTER" ?
          <TopNavigation
            title='편지 작성'
            buttonLabel='다음'
            onPressButton={handleCommit}
            onPressBack={onPressBack}
            buttonDisabled={false}
            type={disabled}
            backIcon={XIcon}
          />
          : <TopNavigation
            title='피드 작성'
            buttonLabel='게시'
            onPressButton={handleCommit}
            onPressBack={onPressBack}
            buttonDisabled={isPosting}
            type={disabled}
            backIcon={XIcon}
          />
        }
      </Animated.View>

      <Animated.View
        style={[styles.container, contentAnimatedStyle]}
      >
        <View style={styles.sectionWrapper}>
          <FoldCorner
            style={styles.fold}
          />
          <ScrollView
            style={styles.section}
            contentContainerStyle={[
              styles.sectionContent,
              {
                paddingBottom: bottomValue + BOTTOM_BAR_HEIGHT,
              },
            ]}
          >
            {recordType === "LETTER" && (
              recordForm.receiver
                ? <Profile
                  name={recordForm.receiver.nickname}
                  imageSource={
                    recordForm.receiver.hasProfileImage && recordForm.receiver.profileImageUrl
                      ? `${API_BASE_URL}${recordForm.receiver.profileImageUrl}`
                      : null
                  }
                  tailText="에게"
                  onPress={() => setRecipientOpen(true)}
                />
                : <Profile type="empty" onPress={() => setRecipientOpen(true)} />
            )}

            <Music
              title={recordForm.music?.musicTitle}
              artist={recordForm.music?.musicArtist}
              imageSource={recordForm.music?.musicArtwork}
              empty={!recordForm.music}
              onPress={() => setMusicOpen(true)}
            />

            <RecordText
              recordForm={recordForm}
              onShowToast={showToast}
              recordType={recordType}
            />

            <RecordImage
              recordForm={recordForm}
              onPressAdd={pickImages}
              onShowToast={showToast}
            />
          </ScrollView>
        </View>
      </Animated.View>
      <View
        pointerEvents="box-none"
        style={[
          styles.toastWrapper,
          {
            bottom: bottomValue,
          },
        ]}
      >
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          color={toast.color}
          actionLabel={toast.actionLabel}
          onPressAction={pressToastAction}
        />
      </View>


      <Animated.View
        style={[
          styles.bottomBarWrapper,
          {
            bottom: bottomValue,
          },
          bottomBarAnimatedStyle,
        ]}
      >
        <BottomBar
          onPressImage={pickImages}
        />
      </Animated.View>


      <Animated.View
        pointerEvents="none"
        style={[
          styles.navigationBarCover,
          {
            height: insets.bottom,
          },
          bottomBarAnimatedStyle,
        ]}
      />

      {isDialogVisible && (
        <View style={styles.dim}>
          <Dialog
            title='작성을 그만둘까요?'
            description={'작성한 내용은 저장되지 않으며\n다시 불러올 수 없습니다.'}
            cancelLabel='계속 작성하기'
            confirmLabel='그만두기'
            onCancel={handleCloseDialog}
            onConfirm={handleConfirmBack}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDim,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },

  container: {
    flex: 1,
    paddingVertical: padding.XL,
    paddingHorizontal: padding.M,
    backgroundColor: colors.bgDefault
  },

  sectionWrapper: {
    flex: 1,
    position: 'relative'
  },

  section: {
    flex: 1,
    // paddingHorizontal: padding.M,
    backgroundColor: colors.bgLayerDefault,
    borderRadius: radius.M,
  },

  sectionContent: {
    paddingTop: padding.S,
    paddingBottom: padding.L,
  },

  fold: {
    position: 'absolute',
    top: -0.5,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },

  toast: {
    position: 'absolute',
    left: padding.M,
    right: padding.M,
    zIndex: 999,
    elevation: 999,
  },

  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 999,
    alignItems: 'center',
  },

  bottomBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },

  navigationBarCover: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgDefault,
    zIndex: 50,
    elevation: 50,
  },
});

export default RecordScreen;