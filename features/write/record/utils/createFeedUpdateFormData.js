export const createFeedUpdateFormData = ({
  recordForm,
  originalFileIds = [],
}) => {
  const formData = new FormData();

  formData.append('text', recordForm.text ?? '');

  if (recordForm.music) {
    formData.append('music', JSON.stringify(recordForm.music));
  }

  if (recordForm.visibility) {
    formData.append('visibility', recordForm.visibility);
  }

  const currentRemoteFileIds = recordForm.files
    .filter(file => file.isRemote && file.serverFileId)
    .map(file => String(file.serverFileId));

  const deleteFileIds = originalFileIds
    .map(id => String(id))
    .filter(id => !currentRemoteFileIds.includes(id));

  formData.append('deleteFileIds', JSON.stringify(deleteFileIds));

  const newFiles = recordForm.files.filter(file => !file.isRemote);

  newFiles.forEach((file) => {
    formData.append('files', {
      uri: file.uri,
      name:
        file.name ??
        file.fileName ??
        file.originalName ??
        `record-file-${Date.now()}`,
      type:
        file.mimeType ??
        file.type ??
        'application/octet-stream',
    });
  });

  return formData;
};