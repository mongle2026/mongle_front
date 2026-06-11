import { useState, useCallback, useRef } from 'react';

const DUMMY_POSTS = [
  {
    feedId: 1,
    user: { nickname: '코코', loginId: 'coco' },
    music: { title: 'Warm on a Cold Night', artist: 'HONNE' },
    record: {
      text: '사실 \'읽기\'란 두려운 것이다. 사사키 아타루가 \'읽기\'와 혁관계를 논의하며 가장 먼저 강조했던 것이 읽기란 본래 영적 접속이기에 읽는 자들은 자연스럽게 자기방어를 하게하사실이 아니었던가. 카프카의 소설을 읽는다는 것은 카기기꿈을 자신의 꿈으로 겪어내야 하는 일이고, 머아카.',
      date: '2026-05-03T09:20:00',
    },
    files: [],
    isBookmarked: false,
    isLiked: false,
  },
  {
    feedId: 2,
    user: { nickname: '달빛', loginId: 'dalbit' },
    music: { title: 'Location', artist: 'Khalid' },
    record: {
      text: '오늘 창밖을 바라보며 오랜만에 멍을 때렸다. 생각이 너무 많아지면 오히려 아무 생각도 안 드는 순간이 찾아온다. 그 순간이 오히려 더 편하게 느껴졌다.',
      date: '2026-06-11T11:30:00',
    },
    files: [],
    isBookmarked: true,
    isLiked: false,
  },
  {
    feedId: 3,
    user: { nickname: '여름밤', loginId: 'summernight' },
    music: { title: 'Sunflower', artist: 'Post Malone' },
    record: {
      text: '오늘 산책하다 찍은 사진들. 별 거 아닌 풍경인데 자꾸 눈이 갔다.',
      date: '2026-06-11T13:45:00',
    },
    files: [
      { url: 'https://picsum.photos/seed/mongle1/400/400', mimeType: 'image/jpeg' },
      { url: 'https://picsum.photos/seed/mongle2/400/400', mimeType: 'image/jpeg' },
    ],
    isBookmarked: false,
    isLiked: false,
  },
  {
    feedId: 4,
    user: { nickname: '봄날', loginId: 'spring' },
    music: { title: 'Cherry Wine', artist: 'Hozier' },
    record: {
      text: '좋아하는 카페에 앉아 책을 읽었다. 커피 향이 글자 사이로 스며드는 기분. 이런 오후가 계속됐으면 좋겠다.',
      date: '2026-05-15T08:00:00',
    },
    files: [],
    isBookmarked: false,
    isLiked: true,
  },
];

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
