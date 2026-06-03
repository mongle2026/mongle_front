import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import ButtonIcon from '../../../shared/components/ButtonIcon';
import XIcon from '../../../assets/icons/ic_x.svg';
import PlusIcon from '../../../assets/icons/ic_plus.svg';

import { colors } from '../../../shared/styles/color';
import { radius } from '../../../shared/styles/token';

export default function Img({
  imageSource,
  onPressAdd,
  onPressDelete,
  style,
}) {
  const hasImage = Boolean(imageSource);

  if (hasImage) {
    return (
      <View style={[styles.container, style]}>
        <ImageBackground
          source={imageSource}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.deleteButtonWrapper}>
            <ButtonIcon
              Icon={XIcon}
              size="S"
              variant="overlay"
              onPress={onPressDelete}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPressAdd}
      style={[styles.container, styles.addContainer, style]}
    >
      <PlusIcon width={24} height={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 165.5,
    height: 169.5,
    overflow: 'hidden',
    borderRadius: radius.XS,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButtonWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgLayerWeak,
  },
});