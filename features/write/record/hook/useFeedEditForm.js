// React
import { useEffect, useState } from 'react';

// 서드파티
import axios from 'axios';

// 스토어
import { useRecordFormStore } from '../../record/store/useRecordFormStore.js';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const toEditFiles = (files = []) => {
  return files
    .filter(file => file.fileType === 'IMAGE')
    .map((file, index) => ({
      uri: `${API_BASE_URL}${file.url}`,
      serverFileId: file.fileId,
      fileType: file.fileType,

      isRemote: true,

      type: file.mimeType,
      mimeType: file.mimeType,
      name: file.originalName ?? `record-image-${file.fileId ?? index}`,
      originalName: file.originalName,
      fileSize: file.fileSize,
    }));
};

export function useFeedEditForm({ feedId, userId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalFileIds, setOriginalFileIds] = useState([]);

  const resetForm = useRecordFormStore(state => state.resetForm);
  const setRecordType = useRecordFormStore(state => state.setRecordType);
  const setText = useRecordFormStore(state => state.setText);
  const setMusic = useRecordFormStore(state => state.setMusic);
  const setFiles = useRecordFormStore(state => state.setFiles);
  const setVisibility = useRecordFormStore(state => state.setVisibility);

  useEffect(() => {
    if (!feedId || !userId) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchEditFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        resetForm();

        const response = await axios.get(
          `${API_BASE_URL}/feed/${feedId}`,
          {
            params: {
              userId,
            },
          }
        );

        if (ignore) {
          return;
        }

        const feed = response.data;

        setRecordType('FEED');
        setText(feed.record?.text ?? '');
        setMusic(feed.music ?? null);
        setVisibility(feed.visibility ?? 'PUBLIC');
        setFiles(toEditFiles(feed.files ?? []));
        setOriginalFileIds(
          feed.files?.map(file => file.fileId) ?? []
        );
      } catch (error) {
        if (!ignore) {
          console.log('수정할 피드 조회 실패:', error);
          setError(error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchEditFeed();

    return () => {
      ignore = true;
      resetForm();
    };
  }, [
    feedId,
    userId,
    resetForm,
    setRecordType,
    setText,
    setMusic,
    setFiles,
    setVisibility,
  ]);

  return {
    loading,
    error,
    originalFileIds,
  };
}