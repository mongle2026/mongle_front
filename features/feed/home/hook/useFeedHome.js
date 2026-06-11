import { useState, useCallback, useRef } from 'react';

const DUMMY_POSTS = [
  {
    feedId: '1',
    visibility: 'PUBLIC',
    user: {
      userId: '101',
      userCode: 'lemon',
      nickname: 'lemon',
      hasProfileImage: true,
      profileImageUrl: 'https://i.pinimg.com/1200x/b5/04/4d/b5044d62249d1d4dce59243804f0a433.jpg',
    },
    record: {
      recordId: '201',
      date: '2026-05-03T09:20:00.000Z',
      text: '성취 동기가 강한 사람은 토네이도 같아서\n주변 사람들을 힘들게 하거나 피해를 주지\n하지만 그 중심은 고요하잖아\n중심을 차지해',
    },
    music: {
      musicId: '301',
      externalId: 'ext_301',
      musicTitle: '태풍의 눈',
      musicArtist: '페퍼톤스',
      musicArtwork: 'https://image.bugsm.co.kr/album/images/500/40798/4079882.jpg',
    },
    files: [],
    isBookmarked: false,
    isLiked: false,
  },
  {
    feedId: '2',
    visibility: 'PUBLIC',
    user: {
      userId: '102',
      userCode: 'pi49asf',
      nickname: '유진',
      hasProfileImage: true,
      profileImageUrl: 'https://i.pinimg.com/736x/b0/42/1e/b0421e3e2daf3c310a871dcd7ec5fcdc.jpg',
    },
    record: {
      recordId: '202',
      date: '2026-06-11T11:30:00.000Z',
      text: '',
    },
    music: {
      musicId: '302',
      externalId: 'ext_302',
      musicTitle: '내 안의 폐허에 닿아',
      musicArtist: '체리필터',
      musicArtwork: 'https://image.bugsm.co.kr/album/images/500/1966/196640.jpg',
    },
    files: [
      { fileId: '401', fileType: 'IMAGE', mimeType: 'image/jpeg', originalName: 'image1.jpg', fileSize: '100000', url: 'https://i.pinimg.com/736x/f9/d8/87/f9d887027f8ebd58167e49e4f8425d92.jpg' },
      { fileId: '402', fileType: 'IMAGE', mimeType: 'image/jpeg', originalName: 'image2.jpg', fileSize: '100000', url: 'https://i.pinimg.com/736x/61/e5/d9/61e5d94a386507a2e1c401cd7426c82f.jpg' },
    ],
    isBookmarked: true,
    isLiked: false,
  },
  {
    feedId: '3',
    visibility: 'PUBLIC',
    user: {
      userId: '103',
      userCode: 'glowwon',
      nickname: 'gyn',
      hasProfileImage: true,
      profileImageUrl: 'https://i.pinimg.com/webp/736x/84/9e/be/849ebea39064a27b4e706870f2e2ce4c.webp',
    },
    record: {
      recordId: '203',
      date: '2026-06-11T13:45:00.000Z',
      text: '전자음악이 왜 슬프지… 기분 이상한 노래… 전자음악 들으면서 힐링한다 슬프다 이런 사람들 이해 안 됐는데 이거 듣고 조금은 이해했다',
    },
    music: {
      musicId: '303',
      externalId: 'ext_303',
      musicTitle: 'Wish',
      musicArtist: 'KIRARA',
      musicArtwork: 'https://image.bugsm.co.kr/album/images/500/201855/20185527.jpg',
    },
    files: [],
    isBookmarked: false,
    isLiked: false,
  },
  {
    feedId: '4',
    visibility: 'PUBLIC',
    user: {
      userId: '104',
      userCode: 'iamabear',
      nickname: '곰',
      hasProfileImage: true,
      profileImageUrl: 'https://i.pinimg.com/webp/736x/73/14/09/731409b1e41fb2621bd5e6f2fb62c7dc.webp',
    },
    record: {
      recordId: '204',
      date: '2026-05-15T08:00:00.000Z',
      text: '이거 들을 때면 코엑스 에이랜드에 매일 같이 가던 때가 떠오른다… (중략) 아직도 그 핸드크림 향이 기억난다 어디서 사신 건지 아직도 모른다 … 아직도…',
    },
    music: {
      musicId: '304',
      externalId: 'ext_304',
      musicTitle: 'Phoenix',
      musicArtist: 'NMIXX',
      musicArtwork: 'https://image.bugsm.co.kr/album/images/500/41299/4129960.jpg',
    },
    files: [],
    isBookmarked: false,
    isLiked: true,
  },
  {
    feedId: '5',
    visibility: 'PUBLIC',
    user: {
      userId: '105',
      userCode: 'spring',
      nickname: '봄이군',
      hasProfileImage: true,
      profileImageUrl: 'https://i.pinimg.com/1200x/e9/58/93/e958936881cfa41d7bbf8d26bfe89820.jpg',
    },
    record: {
      recordId: '205',
      date: '2026-06-10T14:00:00.000Z',
      text: '좋아하는 카페에 앉아 책을 읽었다. 커피 향이 글자 사이로 스며드는 기분. 이런 오후가 자주 왔으면 좋겠어.',
    },
    music: {
      musicId: '305',
      externalId: 'ext_305',
      musicTitle: "Tom's Diner (feat. Suzanne Vega) (7\" Version)",
      musicArtist: 'DNA',
      musicArtwork: 'https://image.bugsm.co.kr/album/images/500/314/31421.jpg',
    },
    files: [],
    isBookmarked: false,
    isLiked: false,
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
