import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import SearchField from '../../../shared/components/SearchField';
import ListRow from '../components/ListRow';
import BottomSheet from '../../../shared/components/BottomSheet';
import { colors } from '../../../shared/styles/color';
import { padding, radius } from '../../../shared/styles/token';
import SelfRecipientRow from './components/SelfRecipientRow';

import UseSelectRecipient from './hook/UseSelectRecipient';
import Empty from '../../../shared/components/Empty';
import { useFloatingBottomOffset } from '../record/hook/useFloatingBottomOffset';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// 로그인 구현 전 임시값입니다.
const TEMP_CURRENT_USER_ID = 1;

export default function SelectRecipient({ visible, onClose }) {
  const [searchFieldHeight, setSearchFieldHeight] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const {
    keyword,
    userList,
    loading,
    selectedRecipientId,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectRecipient,
  } = UseSelectRecipient(onClose, TEMP_CURRENT_USER_ID);

  const trimmedKeyword = keyword.trim();
  const bottomValue = useFloatingBottomOffset();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <SearchField
          value={keyword}
          onChangeText={handleChangeKeyword}
          onFocus={handleFocusSearch}
          placeholder="편지를 받을 사람을 검색해 주세요."
          onLayout={e => setSearchFieldHeight(e.nativeEvent.layout.height)}
        />

        <ScrollView
          style={styles.list}
          bounces={!!trimmedKeyword}
          onScroll={e => setScrolled(e.nativeEvent.contentOffset.y > 0)}
          scrollEventThrottle={16}
        >
          {trimmedKeyword && !loading && userList.length === 0 ? (
            <Empty
              title="일치하는 사용자가 없습니다."
              body="닉네임이나 아이디를 다시 확인해 보세요."
            />
          ) : (
            <View
              style={[
                styles.listContainer,
                {
                  paddingBottom: bottomValue,
                },
              ]}
            >
              {userList.map(item =>
                item.isMe ? (
                  <SelfRecipientRow
                    key={item.id}
                    title={item.nickname}
                    imageSource={
                      item.hasProfileImage && item.profileImageUrl
                        ? `${API_BASE_URL}${item.profileImageUrl}`
                        : null
                    }
                    selected={
                      String(selectedRecipientId) === String(item.id)
                    }
                    onPress={() => handleSelectRecipient(item)}
                  />
                ) : (
                  <ListRow
                    key={item.id}
                    title={item.nickname}
                    subtitle={item.userCode}
                    img={item.img}
                    imageSource={
                      item.hasProfileImage && item.profileImageUrl
                        ? `${API_BASE_URL}${item.profileImageUrl}`
                        : null
                    }
                    caption
                    selected={
                      String(selectedRecipientId) === String(item.id)
                    }
                    onPress={() => handleSelectRecipient(item)}
                  />
                )
              )}
            </View>
          )}
        </ScrollView>

        {scrolled && (
          <LinearGradient
            colors={[colors.bgLayerDefault, colors.bgLayerDefault + '00']}
            style={[styles.gradient, { top: searchFieldHeight }]}
            pointerEvents="none"
          />
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: padding.XL,
    zIndex: 1,
  },
});