import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRecordFormStore } from '../../record/store/useRecordFormStore';

// const API_BASE_URL = 'http://192.168.0.3:3000';
// const API_BASE_URL = 'http://172.19.77.207:3000';
// const API_BASE_URL = 'http://172.19.19.169:3000';
// const API_BASE_URL = 'http://192.168.0.5:3000';
const API_BASE_URL = 'http://192.168.0.35:3000';




export default function UseSelectMusic(_, onClose) {
  const [keyword, setKeyword] = useState('');
  const [selectedMusicId, setSelectedMusicId] = useState(null);

  const music = useRecordFormStore((state) => state.music);
  const setMusic = useRecordFormStore((state) => state.setMusic);
  const [musicList, setMusicList] = useState([]);
  const [popularMusicList, setPopularMusicList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPopularMusics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/music/popular`);
        setPopularMusicList(response.data);
      } catch (error) {
        console.log('인기곡 조회 실패:', error);
        setPopularMusicList([]);
      }
    };

    fetchPopularMusics();
  }, []);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setMusicList([]);
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

  const handleChangeKeyword = text => {
    setKeyword(text);
    setSelectedMusicId(null);
  };

  const handleFocusSearch = () => {
    setSelectedMusicId(null);
  };

  const handleSelectMusic = musicId => {
    // const selected = filteredMusicList.find(m => m.externalId === musicId);
    const trimmedKeyword = keyword.trim();

    const selected = trimmedKeyword
      ? musicList.find(music => music.externalId === musicId)
      : popularMusicList.find(music => music.externalId === musicId);

    if (!selected) return;
    setSelectedMusicId(musicId);
    setMusic(selected);
    onClose?.();
  };

  return {
    keyword,
    musicList,
    popularMusicList,
    selectedMusicId,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
  };
}