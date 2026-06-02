import { View, Text, StyleSheet } from 'react-native';

import TopNavigation from '../../../shared/components/TopNavigation';
import SearchField from '../../../shared/components/SearchField';
import SearchIcon from '../../../assets/icons/ic_search.svg';

import { colors } from '../../../shared/styles/color';
import { gap } from '../../../shared/styles/token';
import { typo } from '../../../shared/styles/typo';

export default function RecipientEmptyView({
  keyword,
  onChangeKeyword,
  onFocusSearch,
  onPressBack,
}) {
  return (
    <View style={styles.container}>
      <TopNavigation
        title="수신인 선택"
        buttonLabel="다음"
        onPressBack={onPressBack}
        buttonDisabled
      />

      <SearchField
        value={keyword}
        onChangeText={onChangeKeyword}
        onFocus={onFocusSearch}
        placeholder="편지를 받을 사람을 검색해 주세요."
      />

      <View style={styles.emptyContainer}>
        <SearchIcon width={40} height={40} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            일치하는 사용자가 없습니다.
          </Text>

          <Text style={styles.description}>
            닉네임이나 아이디를 다시 확인해 보세요.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDefault,
  },
  emptyContainer: {
    marginTop: 181,
    alignItems: 'center',
    gap: gap.L,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    ...typo.bodyMediumStrong,
    color: colors.fgNeutral,
    textAlign: 'center',
  },
  description: {
    ...typo.bodySmall,
    color: colors.fgPlaceholder,
    textAlign: 'center',
  },
});