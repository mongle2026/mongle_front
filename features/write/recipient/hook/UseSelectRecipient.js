import React, { useMemo, useState, useEffect } from 'react';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';
import axios from 'axios';

const MOCK_RECIPIENTS = [
  {
    id: '1',
    username: 'name(나)',
    nickname: '@memeow',
    img: 'profile',
  },
  {
    id: '2',
    username: '코코',
    nickname: '@cocokim',
    img: 'profile',
  },
  {
    id: '3',
    username: '코카콜라',
    nickname: '@cocacolamasida',
    img: 'profile',
  },
  {
    id: '4',
    username: '코코아',
    nickname: '@cocoajoa',
    img: 'profile',
  },
];

const API_BASE_URL = 'http://192.168.0.3:3000';
// const API_BASE_URL = 'http://172.19.77.207:3000';
// const API_BASE_URL = 'http://172.19.19.169:3000';
// const API_BASE_URL = 'http://192.168.0.5:3000';



export default function useSelectRecipient(onClose) {
  const [keyword, setKeyword] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);

  // setRecordType은 지금 메인 없어서 임의로 넣은거임 메인에서 선택하는거 나오면 바로 삭제 
  const setRecordType = useRecordFormStore((state) => state.setRecordType);
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
      return MOCK_RECIPIENTS;
    }

    return MOCK_RECIPIENTS.filter(recipient => {
      return (
        recipient.username.includes(trimmedKeyword) ||
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
    setRecordType("LETTER");

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