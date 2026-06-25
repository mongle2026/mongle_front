import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// TODO(API): GET /feed?userId=:userId

export default function useFeedHome() {
  const [activeTab, setActiveTab] = useState('추천');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState({
    visible: false,
    type: 'success',
    message: '',
    actionLabel: undefined,
  });
  const toastTimerRef = useRef(null);

  // TODO(AUTH): 로그인한 사용자 ID로 교체
  const userId = 1;

  const {
    data: posts = [],
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ['feeds', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/feed`, {
        params: { userId },
      });
      return response.data;
    },
  });

  const onTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const showToast = useCallback(({
    type = 'success',
    message = '기록을 북마크에 추가했습니다.',
    actionLabel,
    duration = 3000,
  } = {}) => {
    clearTimeout(toastTimerRef.current);

    setToast({
      visible: true,
      type,
      message,
      actionLabel,
    });

    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false,
      }));
    }, duration);
  }, []);

  return {
    userId,
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toast,
    refetchFeed,
    onTabPress,
    showToast,
  };
}
