import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View, StyleSheet, Platform, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordFormStore } from '../store/useRecordFormStore';
import TopNavigation from '../../shared/components/TopNavigation';
import Profile from '../../shared/components/Profile.jsx';
import Music from '../../shared/components/Music';
import RecordImage from '../record/components/RecordImage';
import RecordText from '../record/components/RecordText';
import FoldCorner from '../../src/write/assets/graphic_paper.svg';
import BottomBar from '../../src/write/components/BottomBar.jsx';

import { padding } from '../../shared/styles/token';
import { colors } from '../../shared/styles/color';

const LetterPage = () => {
  const recordForm = useRecordFormStore();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopNavigation
        title='편지 작성'
        buttonLabel='다음'
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

            <Profile />
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

export default LetterPage