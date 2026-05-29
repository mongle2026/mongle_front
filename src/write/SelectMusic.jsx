import { View, FlatList } from 'react-native';

import TopNavigation from '../../shared/components/TopNavigation';
import SearchField from '../../shared/components/SearchField';
import ListHeader from '../../shared/components/ListHeader';
import ListRow from './components/ListRow';

import UseSelectMusic from './hook/UseSelectMusic';
import { styles } from './styles/SelectStyle';


export default function SelectMusic({
  navigation,
  searchPlaceholder = '기록할 음악을 검색해 주세요.',
}) {
  const {
    keyword,
    filteredMusicList,
    selectedMusicId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
    handlePressNext,
  } = UseSelectMusic();

  return (
    <View style={styles.container}>
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
        data={filteredMusicList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ListRow
            title={item.title}
            subtitle={item.artist}
            img={item.img}
            imageSource={item.imageSource}
            caption
            selected={selectedMusicId === item.id}
            onPress={() => handleSelectMusic(item.id)}
          />
        )}
      />
    </View>
  );
}