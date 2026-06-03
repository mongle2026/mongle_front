import { View, FlatList } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import SearchField from '../../../shared/components/SearchField';
import ListRow from '../components/ListRow';

import UseSelectRecipient from './hook/UseSelectRecipient';

export default function SelectRecipient({ navigation }) {
  const {
    keyword,
    filteredRecipients,
    userList,
    selectedRecipientId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectRecipient,
    handlePressNext,
  } = UseSelectRecipient(navigation);

  return (
    <View>
      <TopNavigation
        title="수신인 선택"
        buttonLabel="다음"
        onPressBack={() => navigation.goBack()}
        onPressButton={handlePressNext}
        buttonDisabled={!isNextEnabled}
      />

      <SearchField
        value={keyword}
        onChangeText={handleChangeKeyword}
        onFocus={handleFocusSearch}
        placeholder="편지를 받을 사람을 검색해 주세요."
      />

      <FlatList
        data={userList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.nickname}
            subtitle={item.username}
            img={item.image}
            imageSource={item.imageSource}
            caption
            selected={selectedRecipientId === item.id}
            onPress={() => handleSelectRecipient(item.id)}
          />
        )}
      />
    </View>
  );
}