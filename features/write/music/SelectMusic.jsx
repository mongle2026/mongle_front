import { View, FlatList, StyleSheet } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import SearchField from '../../../shared/components/SearchField';
import ListHeader from '../../../shared/components/ListHeader';
import ListRow from '../components/ListRow';

import UseSelectMusic from './hook/UseSelectMusic';

export default function SelectMusic({
  navigation,
  searchPlaceholder = '기록할 음악을 검색해 주세요.',
}) {
  const {
    keyword,
    filteredMusicList,
    musicList,
    selectedMusicId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
    handlePressNext,
  } = UseSelectMusic(navigation);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation
        title="음악 선택"
        buttonLabel="다음"
        onPressBack={() => navigation.goBack()}
        onPressButton={handlePressNext}
        buttonDisabled={!isNextEnabled}
      />

      <SearchField
        value={keyword}
        onChangeText={handleChangeKeyword}
        onFocus={handleFocusSearch}
        placeholder={searchPlaceholder}
      />

      {!keyword.trim() && (
        <ListHeader title="Apple Music 인기곡 10곡" />
      )}

      <FlatList
        style={{ flex: 1 }}
        bounces={!!keyword.trim()}
        data={musicList}
        keyExtractor={item => item.externalId}
        renderItem={({ item }) => (
          <ListRow
            title={item.musicTitle}
            subtitle={item.musicArtist}
            img={item.musicArtwork}
            imageSource={item.musicArtwork}
            caption
            selected={selectedMusicId === item.externalId}
            onPress={() => handleSelectMusic(item.externalId)}
          />
        )}
      />
    </View>
  );
}

});