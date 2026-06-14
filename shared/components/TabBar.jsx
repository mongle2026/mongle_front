import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

function TabItem({ label, isActive, disabled, onPress }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.tabItem}>
      <Text
        style={[
          styles.tabLabel,
          isActive && styles.tabLabelActive,
          disabled && styles.tabLabelDisabled,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// 두 가지 모드 지원:
//
// 1) React Navigation Bottom Tabs의 tabBar prop으로 사용
//    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
//
// 2) 화면 내 독립 탭으로 사용
//    <TabBar
//      tabs={[{ key: 'a', label: '탭A' }, { key: 'b', label: '탭B', disabled: true }]}
//      activeTab="a"
//      onTabPress={(key) => setActive(key)}
//    />
function TabBarInner({ items, activeIndex }) {
  const count = items.length;
  const translateX = useRef(new Animated.Value(activeIndex)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [activeIndex]);

  const tabWidth = containerWidth / count;
  const pillTranslate = translateX.interpolate({
    inputRange: items.map((_, i) => i),
    outputRange: items.map((_, i) => i * tabWidth),
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[styles.pill, { width: tabWidth, transform: [{ translateX: pillTranslate }] }]}
        />
      )}
      {items.map(({ key, label, disabled, onPress, isActive }) => (
        <TabItem key={key} label={label} isActive={isActive} disabled={disabled} onPress={onPress} />
      ))}
    </View>
  );
}

export default function TabBar({ state, descriptors, navigation, tabs, activeTab, onTabPress }) {
  // 독립 모드
  if (tabs) {
    const activeIndex = tabs.findIndex(({ key }) => key === activeTab);
    const items = tabs.map(({ key, label, disabled = false }) => ({
      key, label, disabled,
      isActive: key === activeTab,
      onPress: () => { if (activeTab !== key && !disabled) onTabPress?.(key); },
    }));
    return <TabBarInner items={items} activeIndex={Math.max(activeIndex, 0)} />;
  }

  // React Navigation 모드
  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const isActive = state.index === index;
    const disabled = options.tabBarButton === null;
    return {
      key: route.key, label, isActive, disabled,
      onPress: () => { if (!isActive && !disabled) navigation.navigate(route.name); },
    };
  });
  return <TabBarInner items={items} activeIndex={state.index} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgDefaultWeak,
    width: '100%',
  },
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.XS,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.L,
  },
  tabLabel: {
    ...typo.labelMedium,
    color: colors.fgPlaceholder,
  },
  tabLabelActive: {
    color: colors.fgNeutral,
  },
  tabLabelDisabled: {
    color: colors.fgDisabled,
  },
});
