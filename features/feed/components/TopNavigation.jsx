import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopNavigationItem from './TopNavigationItem';

export default function TopNavigation({ activeTab, onTabPress, rightSlot, style }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, style]}>
      <View style={{ height: insets.top }} />
      <View style={styles.nav}>
        <View style={styles.tabs}>
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
        {rightSlot && (
          <View style={styles.right}>{rightSlot}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  right: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
