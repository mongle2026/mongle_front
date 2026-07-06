// React
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, Keyboard, BackHandler } from 'react-native';

// 서드파티
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

// 스토어 / 훅 / 유틸
import { useRecordFormStore } from '../record/store/useRecordFormStore.js';
import { usePickImages } from './hook/usePickImages.js';
import { useToast } from './hook/useToast.js';
import { useFloatingBottomOffset } from './hook/useFloatingBottomOffset.js';
import { useFeedEditForm } from './hook/useFeedEditForm.js';
import { createFeedUpdateFormData } from './utils/createFeedUpdateFormData.js';

// 공통 컴포넌트
import TopNavigation from '../../../shared/components/TopNavigation.jsx';
import Music from '../../../shared/components/music/Music.jsx';
import Toast from '../../../shared/components/Toast.jsx';
import Dialog from '../../../shared/components/Dialog.jsx';

// 피처 컴포넌트
import RecordText from '../record/components/RecordText.jsx';
import RecordImage from '../record/components/RecordImage.jsx';
import BottomBar from '../components/BottomBar.jsx';
import SelectMusic from '../music/SelectMusic.jsx';

// 스타일
import { padding } from '../../../shared/styles/token';
import { colors } from '../../../shared/styles/color';

// 에셋
import XIcon from '../../../assets/icons/ic_x.svg';
import FoldCorner from '../../../assets/write/graphic_paper.svg';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BOTTOM_BAR_HEIGHT = 40;

const userId = 1;

const RecordEditScreen = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const { feedId } = route?.params ?? {};
  const {
    loading,
    error,
    originalFileIds,
  } = useFeedEditForm({
    feedId,
    userId,
  });

  const recordForm = useRecordFormStore();
  const resetForm = useRecordFormStore(state => state.resetForm);

  const pickImages = usePickImages();
  const { toast, showToast, pressToastAction } = useToast();

  const bottomValue = useFloatingBottomOffset();
  const insets = useSafeAreaInsets();

  const [musicOpen, setMusicOpen] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const buttonType = useMemo(() => {
    return recordForm.music ? 'brand' : 'disabled';
  }, [recordForm.music]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogVisible(false);
  }, []);

  const onPressBack = useCallback(() => {
    Keyboard.dismiss();
    setIsDialogVisible(true);
  }, []);

  const handleConfirmBack = useCallback(() => {
    setIsDialogVisible(false);
    resetForm();
    navigation.goBack();
  }, [navigation, resetForm]);

  useEffect(() => {
    const backAction = () => {
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
  }, [isDialogVisible, handleCloseDialog, onPressBack]);

  const handleUpdateFeed = useCallback(async () => {
    if (!feedId) {
      showToast({
        message: '수정할 피드 정보를 찾을 수 없습니다.',
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
    }

    const formData = createFeedUpdateFormData({
      recordForm,
      originalFileIds,
    });

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/feed/${feedId}`,
        formData,
        {
          params: {
            userId,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: data => data,
        }
      );

      console.log('피드 수정 성공:', response.data);

      await queryClient.invalidateQueries({
        queryKey: ['feed', String(feedId), userId],
      });

      await queryClient.invalidateQueries({
        queryKey: ['feeds'],
      });

      resetForm();

      navigation.goBack();
    } catch (error) {
      console.log('피드 수정 실패 전체 error:', error);

      if (error.response) {
        console.log('피드 수정 실패 상태:', error.response.status);
        console.log('피드 수정 실패 데이터:', error.response.data);
      } else if (error.request) {
        console.log('피드 수정 응답 없음:', error.request);
      } else {
        console.log('피드 수정 요청 설정 오류:', error.message);
      }

      showToast({
        message: '피드 수정에 실패했습니다.',
        type: 'warning',
        duration: 2000,
        color: colors.fgCritical,
      });
    }
  }, [
    feedId,
    userId,
    recordForm,
    originalFileIds,
    showToast,
    resetForm,
    navigation,
    queryClient,
  ]);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgDefault }} />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SelectMusic
        visible={musicOpen}
        onClose={() => setMusicOpen(false)}
        searchPlaceholder="음악을 검색해 주세요."
      />

      <TopNavigation
        title="피드 수정"
        buttonLabel="완료"
        onPressButton={handleUpdateFeed}
        onPressBack={onPressBack}
        buttonDisabled={false}
        type={buttonType}
        backIcon={XIcon}
      />

      <View style={styles.container}>
        <View style={styles.sectionWrapper}>
          <FoldCorner style={styles.fold} />

          <ScrollView
            style={styles.section}
            contentContainerStyle={[
              styles.sectionContent,
              {
                paddingBottom: bottomValue + BOTTOM_BAR_HEIGHT,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
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
              recordType="FEED"
            />

            <RecordImage
              recordForm={recordForm}
              onPressAdd={pickImages}
              onShowToast={showToast}
            />
          </ScrollView>
        </View>
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
          color={toast.color}
          actionLabel={toast.actionLabel}
          onPressAction={pressToastAction}
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
        <BottomBar onPressImage={pickImages} />
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
            title="수정을 그만둘까요?"
            description="수정한 내용은 저장되지 않습니다."
            cancelLabel="계속 수정하기"
            confirmLabel="그만두기"
            onCancel={handleCloseDialog}
            onConfirm={handleConfirmBack}
          />
        </View>
      )}
    </View>
  );
};

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
    backgroundColor: colors.bgDefault,
  },

  sectionWrapper: {
    flex: 1,
    position: 'relative',
  },

  section: {
    flex: 1,
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

export default RecordEditScreen;