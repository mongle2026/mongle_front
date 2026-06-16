import React, { useMemo, useState, useEffect } from 'react';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';
import axios from 'axios';
import { MOCK_RECIPIENTS } from '../data/recipientDummy';

const API_BASE_URL = 'http://192.168.0.3:3000';
// const API_BASE_URL = 'http://172.19.77.207:3000';
// const API_BASE_URL = 'http://172.19.19.169:3000';
// const API_BASE_URL = 'http://192.168.0.5:3000';
// const API_BASE_URL = 'http://192.168.0.35:3000';


export default function useSelectRecipient(onClose) {
  const [keyword, setKeyword] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);

  const setReceiver = useRecordFormStore((state) => state.setReceiver);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setUserList([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/search`, {
          params: {
            keyword: trimmedKeyword,
          },
          signal: controller.signal,
        });

        console.log(response.data)

        setUserList(response.data);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          return;
        }

        console.log('사용자 검색 실패:', error.message);
        setUserList([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);



  const filteredRecipients = useMemo(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return [];
    }

    return userList.filter(recipient => {
      return (
        recipient.userCode.includes(trimmedKeyword) ||
        recipient.nickname.includes(trimmedKeyword)
      );
    });
  }, [keyword]);

  const selectedRecipient = useMemo(() => {
    return filteredRecipients.find(
      recipient => recipient.id === selectedRecipientId
    );
  }, [selectedRecipientId, filteredRecipients]);

  const isNextEnabled = Boolean(selectedRecipientId);

  const handleChangeKeyword = text => {
    setKeyword(text);
    setSelectedRecipientId(null);
  };


  // SearchField에 focus되는 순간 선택 해제
  const handleFocusSearch = () => {
    setSelectedRecipientId(null);
  };

  const handleSelectRecipient = recipientId => {
    // const recipient = filteredRecipients.find(r => r.id === recipientId);
    
    const trimmedKeyword = keyword.trim();

    const recipient = trimmedKeyword
      ? userList.find(r => r.id === recipientId)
      : filteredRecipients.find(r => r.id === recipientId);

    if (!recipient) return;
    setSelectedRecipientId(recipientId);
    setReceiver(recipient);
    onClose?.();
  };

  const handlePressNext = () => {
    if (!selectedRecipient) return;

    setReceiver(selectedRecipient);
    onClose?.();
  };

  return {
    keyword,
    filteredRecipients,
    userList,
    selectedRecipientId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectRecipient,
    handlePressNext,
  };
}