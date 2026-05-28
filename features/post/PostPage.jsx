import React from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View, StyleSheet, Platform, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordFormStore } from '../store/useRecordFormStore';
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

const PostPage = () => {
  const recordForm = useRecordFormStore();

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