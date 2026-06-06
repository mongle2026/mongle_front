import { View, FlatList } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import SearchField from '../../../shared/components/SearchField';
import ListRow from '../components/ListRow';

import UseSelectRecipient from './hook/UseSelectRecipient';

export default function SelectRecipient({ navigation }) {
  const {
    keyword,
    filteredRecipients,
    selectedRecipientId,
    isNextEnabled,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectRecipient,
  } = UseSelectRecipient();

  return (
    <View>
      <TopNavigation
        title="수신인 선택"
        buttonLabel="다음"
        onPressBack={() => navigation.goBack()}
        onPressButton={() => navigation.navigate('SelectMusic')}
        buttonDisabled={!isNextEnabled}
      />

      <SearchField
        value={keyword}
        onChangeText={handleChangeKeyword}
        onFocus={handleFocusSearch}
        placeholder="편지를 받을 사람을 검색해 주세요."
      />

      <FlatList
        data={filteredRecipients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListRow
            title={item.username}
            subtitle={item.nickname}
            img={item.profile}
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