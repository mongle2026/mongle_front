import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const USER_ID = 1;

export default function useFeedHome() {
  const [activeTab, setActiveTab] = useState('추천');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState({
    visible: false,
    type: 'success',
    message: '',
    actionLabel: undefined,
  });
  const [localOverrides, setLocalOverrides] = useState({});
  const toastTimerRef = useRef(null);
  const normalizeFeedItem = (item) => {
    if (!item || !item.feedId) {
      return null;
    }

    return {
      ...item,
      user: item.user ?? {},
      record: item.record ?? {},
      music: item.music ?? null,
      files: Array.isArray(item.files) ? item.files : [],
      isLiked: item.isLiked ?? false,
      isBookmarked: item.isBookmarked ?? false,
      likeCount: item.likeCount ?? 0,
      bookmarkCount: item.bookmarkCount ?? 0,
    };
  };

  const {
    data: apiPosts = [],
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ['feeds', USER_ID],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/feed`, {
        params: {
          userId: USER_ID,
          limit: 20,
        },
      });

      const data = response.data;
      const items = Array.isArray(data) ? data : data?.items;

      return Array.isArray(items)
        ? items
          .map(normalizeFeedItem)
          .filter(Boolean)
        : [];
    },
  });

  const posts = Array.isArray(apiPosts)
    ? apiPosts.map(p => ({
      ...p,
      ...localOverrides[p.feedId],
    }))
    : [];

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
    toast,
    refetchFeed,
    onTabPress,
    showToast,
    toggleLike,
    toggleBookmark,
  };
}
