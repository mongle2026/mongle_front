import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function UseSelectMusic(_, onClose) {
  const [keyword, setKeyword] = useState('');
  const [selectedMusicId, setSelectedMusicId] = useState(null);

  const [popularMusicList, setPopularMusicList] = useState([]);
  const [searchMusicList, setSearchMusicList] = useState([]);

  const [popularLoading, setPopularLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const setMusic = useRecordFormStore((state) => state.setMusic);

  const trimmedKeyword = keyword.trim();

  useEffect(() => {
    const fetchPopularMusics = async () => {
      setPopularLoading(true);

      try {
        const response = await axios.get(`${API_BASE_URL}/music/popular`);
        setPopularMusicList(response.data);
      } catch (error) {
        console.log('인기곡 조회 실패:', error.message);
        setPopularMusicList([]);
      } finally {
        setPopularLoading(false);
      }
    };

    fetchPopularMusics();
  }, []);

  useEffect(() => {
    if (!trimmedKeyword) {
      setSearchMusicList([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();

    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/music/search`, {
          params: { keyword: trimmedKeyword },
          signal: controller.signal,
        });

        setSearchMusicList(response.data);
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
          return;
        }

        console.log('음악 검색 실패:', error.message);
        setSearchMusicList([]);
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedKeyword]);

  const musicList = useMemo(() => {
    return trimmedKeyword ? searchMusicList : popularMusicList;
  }, [trimmedKeyword, searchMusicList, popularMusicList]);

  const loading = trimmedKeyword ? searchLoading : popularLoading;

  const handleChangeKeyword = text => {
    setKeyword(text);
    setSelectedMusicId(null);
  };

  const handleFocusSearch = () => {
    setSelectedMusicId(null);
  };

  const handleSelectMusic = musicId => {
    const selected = musicList.find(music => music.externalId === musicId);

    if (!selected) return;

    setSelectedMusicId(musicId);
    setMusic(selected);
    onClose?.();
  };

  return {
    keyword,
    musicList,
    loading,
    selectedMusicId,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
  };
}