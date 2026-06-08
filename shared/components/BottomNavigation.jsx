import { StyleSheet, View } from 'react-native';
import { shadow, palette, colors } from '../styles/color';
import BottomNavigationItem from './BottomNavigationItem';

export default function BottomNavigation({ items = [] }) {
  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <BottomNavigationItem key={i} {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '192',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgOverlayWeak,
    overflow: 'hidden',
    borderRadius: 200,
    ...shadow.middleDown,
  },
});
