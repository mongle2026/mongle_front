import { useMemo, useState } from 'react';

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

export default function useSelectRecipient() {
  const [keyword, setKeyword] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);

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
    return MOCK_RECIPIENTS.find(
      recipient => recipient.id === selectedRecipientId
    );
  }, [selectedRecipientId]);

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
    setSelectedRecipientId(recipientId);
  };

  const handlePressNext = () => {
    if (!selectedRecipient) return;

    console.log('선택한 수신인:', selectedRecipient);
  };

  return {
  keyword,
  filteredRecipients,
  selectedRecipientId,
  isNextEnabled,
  handleChangeKeyword,
  handleFocusSearch,
  handleSelectRecipient,
  handlePressNext,
};
}