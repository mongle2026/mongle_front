import { useMemo, useState } from 'react';

const MOCK_MUSIC_LIST = [
  {
    id: '1',
    title: 'Warm On A Cold Night',
    artist: 'Honne',
    img: 'music',
  },
  {
    id: '2',
    title: 'Day 1',
    artist: 'Honne',
    img: 'music',
  },
  {
    id: '3',
    title: 'Location Unknown',
    artist: 'Honne',
    img: 'music',
  },
  {
    id: '4',
    title: 'Someone That Loves You',
    artist: 'Honne',
    img: 'music',
  },
  {
    id: '5',
    title: 'No Song Without You',
    artist: 'Honne',
    img: 'music',
  },
  {
    id: '6',
    title: 'Free Love',
    artist: 'Honne',
    img: 'music',
  },
  {
    id: '7',
    title: 'Me & You',
    artist: 'Honne',
    img: 'music',
  },
];

export default function UseSelectMusic() {
  const [keyword, setKeyword] = useState('');
  const [selectedMusicId, setSelectedMusicId] = useState(null);

  const filteredMusicList = useMemo(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return MOCK_MUSIC_LIST;
    }

    return MOCK_MUSIC_LIST.filter(music => {
      return (
        music.title.includes(trimmedKeyword) ||
        music.artist.includes(trimmedKeyword)
      );
    });
  }, [keyword]);

  const selectedMusic = useMemo(() => {
    return MOCK_MUSIC_LIST.find(music => music.id === selectedMusicId);
  }, [selectedMusicId]);

  const isNextEnabled = Boolean(selectedMusicId);

  const handleChangeKeyword = text => {
    setKeyword(text);
    setSelectedMusicId(null);
  };

  const handleFocusSearch = () => {
    setSelectedMusicId(null);
  };

  const handleSelectMusic = musicId => {
    setSelectedMusicId(musicId);
  };

  const handlePressNext = () => {
    if (!selectedMusic) return;

    console.log('선택한 음악:', selectedMusic);
  };

  return {
    keyword,
    filteredMusicList,
    selectedMusicId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
    handlePressNext,
  };
}