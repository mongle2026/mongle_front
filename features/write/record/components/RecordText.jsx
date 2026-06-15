import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { typo } from '../../../../shared/styles/typo';
import { padding } from '../../../../shared/styles/token';
import { colors } from '../../../../shared/styles/color';

const INPUT_TYPO = typo.bodyMedium;

const NOTE_LINE_HEIGHT = 33;
const MIN_LINES = 15;
const TOP_GAP = 8;
const BOTTOM_GAP = 16;
const TEXT_TOP_OFFSET = Platform.OS === 'ios' ? -4 : 4;
const MAX_TEXT_LENGTH = 2000;


const RecordText = ({
  recordForm,
  onShowToast,
  recordType,
}) => {
  const minTextHeight = NOTE_LINE_HEIGHT * MIN_LINES;
  const minWrapperHeight = TOP_GAP + minTextHeight + BOTTOM_GAP;

  const [textHeight, setTextHeight] = useState(minTextHeight);

  const handleChangeText = (text) => {
    if (text.length > MAX_TEXT_LENGTH) {
      onShowToast?.({
        message: '2,000자 이내로 내용을 줄여주세요.',
        type: 'warning',
        duration: 2000,
        color: colors.fgCritical,
      });

      recordForm.setText(text.slice(0, MAX_TEXT_LENGTH));
      return;
    }

    recordForm.setText(text);
  };


  const handleContentSizeChange = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;

    setTextHeight(Math.max(contentHeight, minTextHeight));
  };

  const wrapperHeight = TOP_GAP + textHeight + BOTTOM_GAP;
  const lineCount = Math.ceil(textHeight / NOTE_LINE_HEIGHT);

  return (
    <View style={styles.container}>
      <View style={[styles.lineWrapper, { height: wrapperHeight }]}>
        {Array.from({ length: lineCount }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.line,
              {
                top: TOP_GAP + NOTE_LINE_HEIGHT * (index + 1),
              },
            ]}
          />
        ))}

        <TextInput
          value={recordForm.text}
          onChangeText={handleChangeText}
          multiline
          scrollEnabled={false}
          textAlignVertical="top"
          onContentSizeChange={handleContentSizeChange}
          placeholder={recordType === 'LETTER' ? '음악과 함께 보낼 메시지를 작성해 주세요.' : '오늘 하루를 기록해 주세요.'}
          style={[
            styles.input,
            INPUT_TYPO,
            {
              top: TOP_GAP + TEXT_TOP_OFFSET,
              height: textHeight,
              lineHeight: NOTE_LINE_HEIGHT,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: padding.M,
  },

  lineWrapper: {
    position: 'relative',
  },

  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ddd',
  },

  input: {
    position: 'absolute',
    left: 0,
    right: 0,

    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,

    includeFontPadding: false,
  },
});

export default RecordText;