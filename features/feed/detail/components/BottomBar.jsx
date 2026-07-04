import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TextField from '../../../../shared/components/TextField';
import { colors } from '../../../../shared/styles/color';
import { padding, gap } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';
import ButtonText from '../../../../shared/components/ButtonText';

const MAX_COMMENT_LENGTH = 400;

export default function BottomBar({
  value,
  onChangeText,
  onSubmit,
  disabled = false,
  style,
  ...props
}) {
  const [showCount, setShowCount] = useState(false);

  const textLength = value?.length ?? 0;

  return (
    <View style={[styles.container, style]}>
      <TextField
        value={value}
        onChangeText={onChangeText}
        onMaxHeightChange={setShowCount}
        maxLength={MAX_COMMENT_LENGTH}
        style={styles.textField}
        {...props}
      />

      <View style={styles.buttonColumn}>
        <ButtonText
          label="전송"
          onPress={onSubmit}
          disabled={disabled}
        />

        {showCount && (
          <Text style={styles.countText}>
            {textLength}
            {'\n'}
            / {MAX_COMMENT_LENGTH}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',

    paddingVertical: padding.L,
    paddingHorizontal: padding.XL,

    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: gap.M,

    borderTopWidth: 1,
    borderTopColor: colors.strokeNeutralWeak,

    backgroundColor: colors.bgLayerDefault,
  },

  textField: {
    flex: 1,
  },

  buttonColumn: {
    alignItems: 'center',
    flexShrink: 0,
  },

  countText: {
    color: colors.fgNeutralWeak,
    textAlign: 'center',

    ...typo.captionSmall,
  },
});