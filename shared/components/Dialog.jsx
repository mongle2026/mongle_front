import { View, Text, StyleSheet } from 'react-native';

import Button from './Button';
import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

export default function Dialog({
  title = '작성을 그만둘까요?',
  description = '작성한 내용은 저장되지 않으며\n다시 불러올 수 없습니다.',
  cancelLabel = '계속 작성하기',
  confirmLabel = '그만두기',
  onCancel,
  onConfirm,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          label={cancelLabel}
          color="layerWeak"
          onPress={onCancel}
          style={styles.button}
        />

        <Button
          label={confirmLabel}
          color="critical"
          onPress={onConfirm}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 302,
    minHeight: 158,
    padding: padding.XL,
    gap: gap.L,
    borderRadius: radius.XL,
    backgroundColor: colors.bgLayerDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    gap: gap.M,
  },
  title: {
    ...typo.titleLarge,
    color: colors.fgLayerNeutral,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  description: {
    ...typo.bodySmall,
    color: colors.fgLayerNeutralWeak,
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
  },
  button: {
    flex: 1,
    minHeight: 40,
  },
});