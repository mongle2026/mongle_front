import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const MAX_IMAGES = 2;

const RecordImage = ({
  recordForm,
}) => {
  const images = recordForm.files.filter(file => file.fileType === 'IMAGE');

  const pickImages = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset, index) => ({
        uri: asset.uri,
        name: asset.fileName ?? `image-${Date.now()}-${index}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
        fileType: 'IMAGE',
      }));

      const currentImages = recordForm.files.filter(file => file.fileType === 'IMAGE');
      const otherFiles = recordForm.files.filter(file => file.fileType !== 'IMAGE');

      const nextImages = [...currentImages, ...selectedImages].slice(0, 2);

      recordForm.setFiles([...otherFiles, ...nextImages]);
    }
  };

  const handleRemoveImage = uri => {
    recordForm.removeFile(uri);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.previewContainer}>
        {images.map((image, index) => (
          <View key={`${image.uri}-${index}`} style={styles.imageBox}>
            <Image source={{ uri: image.uri }} style={styles.previewImage} />

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(image.uri)}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 2 && (
          <TouchableOpacity style={styles.addButton} onPress={pickImages}>
            <Text style={styles.addButtonText}>사진 추가</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  previewContainer: {
    marginTop: 16,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addButtonText: {
    fontSize: 14,
  },
  imageBox: {
    position: "relative",
    marginRight: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default RecordImage;