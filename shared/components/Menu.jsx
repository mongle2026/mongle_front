import { StyleSheet, View } from 'react-native';

import PencilIcon from '../../assets/icons/ic_pencil.svg';
import TrashIcon from '../../assets/icons/ic_trash.svg';
import { colors, shadow } from '../styles/color';
import { gap, radius } from '../styles/token';
import MenuItem from './MenuItem';

export default function Menu({ onEdit, onDelete }) {
  return (
    <View style={styles.container}>
      <MenuItem
        Icon={PencilIcon}
        label="수정하기"
        textColor={colors.fgLayerNeutral}
        onPress={onEdit}
      />
      <MenuItem
        Icon={TrashIcon}
        label="삭제하기"
        textColor={colors.fgCriticalStrong}
        onPress={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgLayerSurface,
    borderRadius: radius.M,
    gap: gap.XS,
    overflow: 'hidden',
    ...shadow.middleDown,
  },
});
