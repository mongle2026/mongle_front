import { useState, useCallback, useRef } from 'react';
import { DUMMY_POSTS } from '../data/feedDummy';

export default function useFeedHome() {
  const [activeTab, setActiveTab] = useState('추천');
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  const fetchFeed = useCallback(() => {
    setPosts(DUMMY_POSTS);
  }, []);

  const onTabPress = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const showToast = useCallback(() => {
    setToastVisible(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const toggleBookmark = useCallback((feedId) => {
    setPosts(prev => {
      const post = prev.find(p => p.feedId === feedId);
      const adding = !post?.isBookmarked;
      if (adding) showToast();
      return prev.map(p => p.feedId === feedId ? { ...p, isBookmarked: adding } : p);
    });
  }, [showToast]);

  const undoLastBookmark = useCallback(() => {
    setToastVisible(false);
    clearTimeout(toastTimerRef.current);
    setPosts(prev => {
      const lastBookmarked = [...prev].reverse().find(p => p.isBookmarked);
      if (!lastBookmarked) return prev;
      return prev.map(p => p.feedId === lastBookmarked.feedId ? { ...p, isBookmarked: false } : p);
    });
  }, []);

  const toggleLike = useCallback((feedId) => {
    setPosts(prev => prev.map(p =>
      p.feedId === feedId ? { ...p, isLiked: !p.isLiked } : p
    ));
  }, []);

  return {
    activeTab,
    posts,
    currentIndex,
    setCurrentIndex,
    toastVisible,
    fetchFeed,
    onTabPress,
    toggleBookmark,
    toggleLike,
    undoLastBookmark,
  };
}
