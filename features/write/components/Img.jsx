import { ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ButtonIcon from '../../../shared/components/ButtonIcon';
import XIcon from '../../../assets/icons/ic_x.svg';
import PlusIcon from '../../../assets/icons/ic_plus.svg';

import { colors } from '../../../shared/styles/color';
import { gap, padding, radius } from '../../../shared/styles/token';

export default function Img({
  recordForm,
  imageSource,
  onPressAdd,
  onPressDelete,
  style,
  variant,
}) {
  if (variant === 'ImgOnly') {
    return (
      <View style={[styles.container, style]}>
        <ImageBackground
          source={imageSource}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
    );
  }

  const images = recordForm.files.filter(file => file.fileType === 'IMAGE');
  const handleRemoveImage = uri => { recordForm.removeFile(uri); };

  return (
    <ScrollView
      horizontal
      style={styles.previewContainer}
      contentContainerStyle={{ gap: gap.S }}
    >
      {images.map((image, index) => (
        <View style={[styles.container, style]}>
          <ImageBackground
            key={`${image.uri}-${index}`}
            source={{ uri: image.uri }}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.deleteButtonWrapper}>
              <ButtonIcon
                Icon={XIcon}
                size="S"
                variant="overlay"
                onPress={() => handleRemoveImage(image.uri)}
              />
            </View>
          </ImageBackground>
        </View>
      ))}
      {images.length == 1 && (
        <Pressable
          onPress={onPressAdd}
          style={[styles.container, styles.addContainer, style]}
        >
          <PlusIcon width={24} height={24} />
        </Pressable>
      )}
    </ScrollView>
  );


  // return (
  //   <Pressable
  //     onPress={onPressAdd}
  //     style={[styles.container, styles.addContainer, style]}
  //   >
  //     <PlusIcon width={24} height={24} />
  //   </Pressable>
  // );
}

const styles = StyleSheet.create({
  previewContainer: {
    paddingHorizontal: padding.L,
  },
  container: {
    width: 160,
    height: 160,
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