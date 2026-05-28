// import { useState } from 'react';
// import { View, Button, Text } from 'react-native';
// import { Audio } from 'expo-av';

// const RecordAudio = ({
//   recordForm
// }) => {
//   const [recording, setRecording] = useState(null);

//   const saveAudioFile = (uri) => {
//     const audioFile = {
//       uri,
//       name: `voice-${Date.now()}.m4a`,
//       type: 'audio/m4a',
//       fileType: 'audio',
//     };

//     recordForm.setFiles([
//       ...recordForm.files.filter((file) => file.fileType !== 'audio'),
//       audioFile,
//     ]);
//   };

//   const startRecording = async () => {
//     try {
//       const permission = await Audio.requestPermissionsAsync();

//       if (!permission.granted) {
//         alert('마이크 권한이 필요합니다.');
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       setRecording(recording);
//     } catch (error) {
//       console.log('녹음 시작 오류:', error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       if (!recording) return;

//       await recording.stopAndUnloadAsync();

//       const uri = recording.getURI();

//       saveAudioFile(uri);

//       setRecording(null);
//     } catch (error) {
//       console.log('녹음 종료 오류:', error);
//     }
//   };

//   return (
//     <View>
//       <Button
//         title={recording ? '녹음 중지' : '녹음 시작'}
//         onPress={recording ? stopRecording : startRecording}
//       />

//       <Button
//         title="녹음 삭제"
//         onPress={() => {
//           const audioFile = recordForm.files.find(
//             (file) => file.fileType === 'audio'
//           );

//           if (!audioFile) return;

//           recordForm.removeFile(audioFile.uri);
//         }}
//       />
//     </View>
//   );
// }

// export default RecordAudio;