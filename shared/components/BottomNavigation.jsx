import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { shadow, colors } from '../styles/color';
import BottomNavigationItem from './BottomNavigationItem';

export default function BottomNavigation({ items = [] }) {
  return (
    <BlurView
      intensity={40}
      tint="dark"
      experimentalBlurMethod="dimezisBlurView"
      style={styles.container}
    >
      {items.map((item, i) => (
        <BottomNavigationItem key={i} {...item} />
      ))}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgOverlayWeak,
    overflow: 'hidden',
    borderRadius: 200,
    ...shadow.middleDown,
  },
});
