import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopNavigationItem from './TopNavigationItem';

export default function TopNavigation({ activeTab, onTabPress, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, style]}>
      <View style={{ height: insets.top }} />
      <View style={styles.nav}>
        <TopNavigationItem
          label="추천"
          isActive={activeTab === '추천'}
          onPress={() => onTabPress?.('추천')}
        />
        <TopNavigationItem
          label="팔로잉"
          isActive={activeTab === '팔로잉'}
          onPress={() => onTabPress?.('팔로잉')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  nav: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
