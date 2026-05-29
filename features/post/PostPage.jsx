import React from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View, StyleSheet, Platform, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordFormStore } from '../record/store/useRecordFormStore.js';
import RecordImage from '../record/components/RecordImage';
import RecordAudio from '../record/components/RecordAudio';
import RecordFormDebug from '../letter/components/RecordFormDebug';
import TopNavigation from '../../shared/components/TopNavigation';
import Music from '../../shared/components/Music';
import RecordText from '../record/components/RecordText';
import { padding, gap } from '../../shared/styles/token';
import { colors } from '../../shared/styles/color';
import FoldCorner from '../../src/write/assets/graphic_paper.svg';
import BottomBar from '../../src/write/components/BottomBar.jsx';
import axios from 'axios';

const PostPage = () => {
  const recordForm = useRecordFormStore();

  const handleCommit = async () => {
    const formData = new FormData();

    // formData.append('recordType', recordForm.recordType);
    // 글 기록
    formData.append('text', recordForm.text);

    // 공개 범위
    // formData.append('visibility', recordForm.visibility);

    // 노래 
    formData.append('music', JSON.stringify(recordForm.music));

    // 사진, 음성 
    recordForm.files.forEach(file => {
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      formData.append('fileTypes', file.fileType);
    });


    // 편지 전용 
    if (recordForm.recordType === 'letter' && recordForm.receiver) {
      formData.append('receiverId', String(recordForm.receiver.id));
    }

    const response = await axios('http://localhost:3000/records', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('글 작성에 실패했습니다.');
    }

    const data = await response.json();

    recordForm.resetForm();

    return data;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopNavigation
        title='피드 작성'
        buttonLabel='게시'
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

export default PostPage;