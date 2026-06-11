export const createRecordFormData = ({
  userId,
  recordForm,
  recordType,
  letterCover,
}) => {
  const formData = new FormData();

  formData.append('userId', userId);

  // 노래
  formData.append('music', JSON.stringify(recordForm.music));

  // 글 기록
  formData.append('text', recordForm.text);

  // 사진, 음성
  recordForm.files?.forEach((file, index) => {
    formData.append('files', {
      uri: file.uri,
      name: file.name ?? `file-${Date.now()}-${index}.jpg`,
      type: file.type ?? 'image/jpeg',
    });

    formData.append('fileTypes', file.fileType);
  });

  if (recordType === "FEED") {
    //   formData.append('visibility', recordForm.visibility);
    formData.append('visibility', "PUBLIC");
  } else if (recordType === "LETTER") {
    // 받는 사람 
    formData.append('receiverId', String(recordForm.receiver.id));

    // 편지 값 (useLetterCoverStore에서 저장된것 사용)
    formData.append('pattern', letterCover.patternId);
    formData.append('color', letterCover.colorId);
    formData.append('stamp', letterCover.stampId);
    if (userId === recordForm.receiver.id) {
      // 도착 날짜
      formData.append('deliveryAt', recordForm.deliveryAt);
    }
  }

  return formData;
};