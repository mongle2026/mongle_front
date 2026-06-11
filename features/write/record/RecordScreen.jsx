import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, View, StyleSheet, Platform, Pressable, Image, Keyboard, BackHandler } from 'react-native'
import { useRecordFormStore } from '../record/store/useRecordFormStore.js';
import RecordImage from '../record/components/RecordImage.jsx';
import RecordAudio from '../record/components/RecordAudio.jsx';
import TopNavigation from '../../../shared/components/TopNavigation.jsx';
import XIcon from '../../../assets/icons/ic_x.svg';
import Music from '../../../shared/components/Music';
import RecordText from '../record/components/RecordText.jsx';
import { padding, gap } from '../../../shared/styles/token';
import { colors } from '../../../shared/styles/color';
import FoldCorner from '../../../assets/write/graphic_paper.svg';
import BottomBar from '../components/BottomBar.jsx';
import axios from 'axios';
import Profile from '../../../shared/components/Profile.jsx';
import Img from '../components/Img.jsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePickImages } from './hook/usePickImages.js';
import { createRecordFormData } from '../utils/createRecordFormData .js';
import SelectRecipient from '../recipient/SelectRecipientScreen.jsx';
import SelectMusic from '../music/SelectMusic.jsx';
import { useToast } from './hook/useToast.js';
import Toast from '../../../shared/components/Toast.jsx';
import { useFloatingBottomOffset } from './hook/useFloatingBottomOffset.js';
import Dialog from '../../../shared/components/Dialog.jsx';

const API_BASE_URL = 'http://192.168.0.3:3000';
// const API_BASE_URL = 'http://192.168.0.5:3000';
const BOTTOM_BAR_HEIGHT = 40;

const RecordScreen = ({ navigation }) => {
  const recordForm = useRecordFormStore();
  // const recordType = useRecordFormStore(state => state.recordType);
  const recordType = "LETTER";
  // 나
  const userId = '1';

  const pickImages = usePickImages();
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);

  const { toast, showToast } = useToast();
  const bottomValue = useFloatingBottomOffset();
  const insets = useSafeAreaInsets();

  const [disabled, setDisabled] = useState('disable');
  const [isDialogVisible, setIsDialogVisible] = useState(false);


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
      routes: [{ name: 'Home' }],
    });
  };

  useEffect(() => {
    const backAction = () => {
      if (isDialogVisible) {
        handleCloseDialog();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isDialogVisible]);

  const handleCommit = async () => {
    if (recordType === 'LETTER' && recordForm.receiver === null) {
      showToast({
        message: '수신인을 지정해 주세요.',
        type: 'warning',
        duration: 2000,
      });
      return;
    }

    if (recordForm.music === null) {
      showToast({
        message: '음악을 선택해 주세요.',
        type: 'warning',
        duration: 2000,
      });
      return;
    }

    if (recordForm.text === '' && recordForm.files.length === 0) {
      showToast({
        message: '메시지를 작성하거나 사진을 첨부해 주세요.',
        type: 'warning',
        duration: 2000,
      });
      return;
    };

    if (recordType === "FEED") {
      const formData = createRecordFormData({
        userId,
        recordForm,
        recordType
      });

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
      }

      recordForm.resetForm();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

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
          onPressBack={() => navigation.goBack()}
          buttonDisabled={false}
          type={disabled}
          backIcon={XIcon}
        />
      }

      <View
        style={styles.container}
      >
        <ScrollView
          style={styles.section}
          contentContainerStyle={[
            styles.sectionContent,
            {
              paddingBottom: bottomValue + BOTTOM_BAR_HEIGHT,
            },
          ]}
        >
          <FoldCorner
            style={styles.fold}
          />
          {recordType === "LETTER" && (
            recordForm.receiver
              ? <Profile
                name={recordForm.receiver.nickname}
                imageSource={recordForm.receiver.image}
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
          />

          <RecordImage
            recordForm={recordForm}
            onPressAdd={pickImages}
            onShowToast={showToast}
          />
        </ScrollView>

      </View>
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
        // style={[
        //   styles.toast,
        //   {
        //     bottom: bottomValue,
        //   },
        // ]}
        />
      </View>


      <View
        style={[
          styles.bottomBarWrapper,
          {
            bottom: bottomValue,
          },
        ]}
      >
        <BottomBar
          onPressImage={pickImages}
        />
      </View>


      <View
        pointerEvents="none"
        style={[
          styles.navigationBarCover,
          {
            height: insets.bottom,
          },
        ]}
      />

      {isDialogVisible && (
        <View style={styles.dim}>
          <Dialog
            title='작성을 그만둘까요?'
            description='작성한 내용은 저장되지 않으며\n다시 불러올 수 없습니다.'
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    borderRadius: 2,
  },

  sectionContent: {
    paddingVertical: 16,
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