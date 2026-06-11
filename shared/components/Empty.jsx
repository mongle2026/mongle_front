// <Empty title="검색 결과 없음" body="다른 키워드로 검색해보세요" />
// <Empty title="..." body="..." icon={CustomIcon} />
import { View, Text, StyleSheet } from 'react-native';
import SearchIcon from '../../assets/icons/ic_search.svg';
import { colors } from '../styles/color';
import { gap, padding } from '../styles/token';
import { typo } from '../styles/typo';

export default function Empty({ title, body, icon: Icon = SearchIcon }) {
  return (
    <View style={styles.container}>
      <Icon width={40} height={40} color={colors.fgLayerNeutralWeak} />
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: padding.XL,
    gap: gap.L,
  },
  texts: {
    alignItems: 'center',
    gap: gap.XS,
    width: '100%',
  },
  title: {
    ...typo.titleLarge,
    color: colors.fgPlaceholder,
    textAlign: 'center',
  },
  body: {
    ...typo.bodySmall,
    color: colors.fgLayerNeutralWeak,
    textAlign: 'center',
  },
});
