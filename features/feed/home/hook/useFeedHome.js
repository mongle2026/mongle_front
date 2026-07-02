import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const USER_ID = 1;

export default function useFeedHome() {
  const [activeTab, setActiveTab] = useState('추천');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [localOverrides, setLocalOverrides] = useState({});
  const toastTimerRef = useRef(null);

  const {
    data: apiPosts = [],
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ['feeds', USER_ID],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/feed`, {
        params: { userId: USER_ID },
      });
      return response.data;
    },
  });

  const posts = apiPosts.map(p => ({ ...p, ...localOverrides[p.feedId] }));

  const onTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const showToast = useCallback(() => {
    setToastVisible(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const toggleLike = useCallback((feed) => {
    if (!feed?.feedId) return;
    setLocalOverrides(prev => ({
      ...prev,
      [feed.feedId]: { ...prev[feed.feedId], isLiked: !(prev[feed.feedId]?.isLiked ?? feed.isLiked) },
    }));
  }, []);

  const toggleBookmark = useCallback((feed) => {
    if (!feed?.feedId) return;
    const nextBookmarked = !(localOverrides[feed.feedId]?.isBookmarked ?? feed.isBookmarked);
    setLocalOverrides(prev => ({
      ...prev,
      [feed.feedId]: { ...prev[feed.feedId], isBookmarked: nextBookmarked },
    }));
    if (nextBookmarked) showToast();
  }, [localOverrides, showToast]);

  return {
    userId: USER_ID,
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toastVisible,
    refetchFeed,
    onTabPress,
    showToast,
    toggleLike,
    toggleBookmark,
  };
}
