import React from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View, StyleSheet, Platform, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordFormStore } from '../record/store/useRecordFormStore.js';
import RecordImage from '../record/components/RecordImage.jsx';
import RecordAudio from '../record/components/RecordAudio.jsx';
import RecordFormDebug from '../letter/components/RecordFormDebug.jsx';
import TopNavigation from '../../../shared/components/TopNavigation.jsx';
import Music from '../../../shared/components/Music';
import RecordText from '../record/components/RecordText.jsx';
import { padding, gap } from '../../../shared/styles/token';
import { colors } from '../../../shared/styles/color';
import FoldCorner from '../../../assets/write/graphic_paper.svg';
import BottomBar from '../components/BottomBar.jsx';
import axios from 'axios';

const FeedScreen = () => {
  const recordForm = useRecordFormStore();

  const handleCommit = async () => {
    const formData = new FormData();

    // 임시 데이터 
    const music = {
      externalId: '269573364',
      musicTitle: 'Billie Jean',
      musicArtist: 'Michael Jackson',
      musicGenre: ['팝'],
      musicArtwork:
        'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/32/4f/fd/324ffda2-9e51-8f6a-0c2d-c6fd2b41ac55/074643811224.jpg/100x100bb.jpg',
      previewUrl:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/dc/bc/8a/dcbc8a3e-4ce1-c00d-cc02-eda2212053c7/mzaf_8347559338388601510.plus.aac.p.m4a',
    };

    formData.append('userId', '1');
    formData.append('music', JSON.stringify(music));
    formData.append('visibility', "PUBLIC");


    // formData.append('recordType', recordForm.recordType);
    // 글 기록
    formData.append('text', recordForm.text);

    // 공개 범위
    // formData.append('visibility', recordForm.visibility);

    // 노래 
    // formData.append('music', JSON.stringify(recordForm.music));

    // 사진, 음성 
    recordForm.files.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
        fileType: file.fileType
      });

      formData.append('fileTypes', file.fileType);
    });


    // 편지 전용 
    if (recordForm.recordType === 'letter' && recordForm.receiver) {
      formData.append('receiverId', String(recordForm.receiver.id));
    }

    console.log('게시 눌림');


    // =========== 전송 ============
    try {
      const response = await axios.post(
        'http://localhost:3000/feed',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data) => data,
        }
      );

      // const response = await fetch('http://localhost:3000/feed', {
      //   method: 'POST',
      //   body: formData,
      // });

      // const data = await response.json();

      // console.log('응답 상태:', response.status);
      // console.log('응답 데이터 전체:', JSON.stringify(data, null, 2));
      // console.log('응답 message:', data.message);

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
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopNavigation
        title='피드 작성'
        buttonLabel='게시'
        onPressButton={handleCommit}
        buttonDisabled={false}
      />
      <View style={styles.container}>
        <View style={styles.sectionWrapper}>
          <FoldCorner
            style={styles.fold}
          />

          <ScrollView
            style={styles.section}
            contentContainerStyle={styles.sectionContent}
          >

            <Music />

            <RecordText
              recordForm={recordForm}
            />

            <RecordImage
              recordForm={recordForm}
            />

            {/* <RecordFormDebug /> */}

          </ScrollView>
        </View>
        <BottomBar />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
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
});

export default FeedScreen;