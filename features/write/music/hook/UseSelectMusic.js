import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';

const MOCK_MUSIC_LIST = [
  { externalId: '1', musicTitle: 'Warm On A Cold Night', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '2', musicTitle: 'Day 1', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '3', musicTitle: 'Location Unknown', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '4', musicTitle: 'Someone That Loves You', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '5', musicTitle: 'No Song Without You', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '6', musicTitle: 'Free Love', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '7', musicTitle: 'Me & You', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '8', musicTitle: 'Crying Over You', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '9', musicTitle: 'By Your Side', musicArtist: 'Honne', musicArtwork: null },
  { externalId: '10', musicTitle: 'Gone Are The Days', musicArtist: 'Honne', musicArtwork: null },
];

const API_BASE_URL = 'http://192.168.0.3:3000';

export default function UseSelectMusic(_, onClose) {
  const [keyword, setKeyword] = useState('');
  const [selectedMusicId, setSelectedMusicId] = useState(null);

  const music = useRecordFormStore((state) => state.music);
  const setMusic = useRecordFormStore((state) => state.setMusic);
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setMusicList(MOCK_MUSIC_LIST);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/music/search`, {
          params: {
            keyword: trimmedKeyword,
          },
          signal: controller.signal,
        });

        console.log('음악 검색 응답:', JSON.stringify(response.data));
        setMusicList(response.data);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          return;
        }

        console.log('음악 검색 실패:', error.message);
        setMusicList([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  // filteredMusicList는 더미데이터로 테스트가 필요없어질 때 삭제
  // 혹시 계속 더미데이터로 테스트 할 때 필요할까봐 살려둡니다 
  // <FlatList data={musicList} ... /> filteredMusicList를 사용할 때는 SelectMusic.jsx가서 musicList를 filteredMusicList로 변경 반드시 필요함! 
  const filteredMusicList = useMemo(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return MOCK_MUSIC_LIST;
    }

    return MOCK_MUSIC_LIST.filter(music => {
      return (
        music.musicTitle.includes(trimmedKeyword) ||
        music.musicArtist.includes(trimmedKeyword)
      );
    });
  }, [keyword]);

  const selectedMusic = useMemo(() => {
    // return MOCK_MUSIC_LIST.find(music => music.id === selectedMusicId);
    return musicList.find(music => music.externalId === selectedMusicId);
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
    const selected = filteredMusicList.find(m => m.externalId === musicId);
    if (!selected) return;
    setSelectedMusicId(musicId);
    setMusic(selected);
    onClose?.();
  };

  const handlePressNext = () => {
    if (!selectedMusic) return;
    setMusic(selectedMusic);
    onClose?.();
  };

  return {
    keyword,
    filteredMusicList,
    musicList,
    selectedMusicId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
    handlePressNext,
  };
}