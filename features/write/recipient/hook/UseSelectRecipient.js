import { useState, useEffect } from 'react';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function useSelectRecipient(onClose, currentUserId) {
  const [keyword, setKeyword] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const setReceiver = useRecordFormStore((state) => state.setReceiver);

  useEffect(() => {
    if (!currentUserId) return;

    const trimmedKeyword = keyword.trim();
    const controller = new AbortController();

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/search`, {
          params: {
            keyword: trimmedKeyword,
            currentUserId,
          },
          signal: controller.signal,
        });

        setUserList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          return;
        }

        console.log('사용자 검색 실패:', error.message);
        setUserList([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, trimmedKeyword ? 400 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword, currentUserId]);

  const handleChangeKeyword = text => {
    setKeyword(text);
    setSelectedRecipientId(null);
  };

  const handleFocusSearch = () => {
    setSelectedRecipientId(null);
  };

  const handleSelectRecipient = recipient => {
    if (!recipient) return;

    setSelectedRecipientId(recipient.id);
    setReceiver(recipient);
    onClose?.();
  };

  return {
    keyword,
    userList,
    loading,
    selectedRecipientId,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectRecipient,
  };
}