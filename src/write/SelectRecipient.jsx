import { View, FlatList } from 'react-native';

import TopNavigation from '../../shared/components/TopNavigation';
import SearchField from '../../shared/components/SearchField';
import ListRow from './components/ListRow';

import UseSelectRecipient from './hook/UseSelectRecipient';
import { styles } from './styles/SelectRecipientStyle';

import Profile from '../../shared/components/Profile';

export default function SelectRecipient() {
  const {
    keyword,
    filteredRecipients,
    selectedRecipientId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectRecipient,
    handlePressNext,
  } = UseSelectRecipient();

  return (
    <View style={styles.container}>
      <TopNavigation
        title="수신인 선택"
        buttonLabel="다음"
        onPressBack={() => console.log('뒤로가기')}
        onPressButton={handlePressNext}
        buttonDisabled={!isNextEnabled}
      />

      <Profile name="코코" />
      <SearchField
        value={keyword}
        onChangeText={handleChangeKeyword}
        onFocus={handleFocusSearch}
        placeholder="편지를 받을 사람을 검색해 주세요."
      />

      <FlatList
        data={filteredRecipients}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
         <ListRow
            title={item.username}
            subtitle={item.nickname}
            img={item.img}
            caption
            selected={selectedRecipientId === item.id}
            onPress={() => handleSelectRecipient(item.id)}
          />
        )}
      />
    </View>
  );
}