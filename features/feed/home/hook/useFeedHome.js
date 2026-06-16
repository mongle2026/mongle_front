import { useState, useCallback, useRef } from 'react';
import { DUMMY_POSTS } from '../data/feedDummy';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function useFeedHome() {
  const [activeTab, setActiveTab] = useState('추천');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);
  // 하드코딩
  const userId = 1;

  const {
    data: posts = [],
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ['feeds', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/feed`, {
        params: {
          userId,
        },
      });

      return response.data;
    },
  });

  const onTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const showToast = useCallback(() => {
    setToastVisible(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  return {
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toastVisible,
    refetchFeed,
    onTabPress,
    showToast,
  };
}
