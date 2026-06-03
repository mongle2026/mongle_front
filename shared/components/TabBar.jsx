import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../styles/color';
import { padding, radius } from '../styles/token';
import { typo } from '../styles/typo';

// TabBar 내부 전용 컴포넌트 — 외부 export 없음
function TabItem({ label, isActive, disabled, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.tabItem, isActive && styles.tabItemActive, disabled && styles.tabItemDisabled]}
    >
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
export default function TabBar({ state, descriptors, navigation, tabs, activeTab, onTabPress }) {
  // 독립 모드: tabs 배열을 직접 받은 경우
  if (tabs) {
    return (
      <View style={styles.container}>
        {tabs.map(({ key, label, disabled = false }) => (
          <TabItem
            key={key}
            label={label}
            isActive={activeTab === key}
            disabled={disabled}
            onPress={() => {
              if (activeTab !== key && !disabled) onTabPress?.(key);
            }}
          />
        ))}
      </View>
    );
  }

  // React Navigation 모드
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name; // 우선순위: tabBarLabel > title > route.name
        const isActive = state.index === index;
        const disabled = options.tabBarButton === null; // tabBarButton: null 이면 비활성화

        return (
          <TabItem
            key={route.key}
            label={label}
            isActive={isActive}
            disabled={disabled}
            onPress={() => {
              if (!isActive && !disabled) navigation.navigate(route.name);
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgDefaultWeak,
    width: '100%',
  },
  tabItem: {
    flex: 1, // 탭 개수에 관계없이 균등 분할
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.L,
    borderRadius: radius.XS,
  },
  tabItemActive: {
    backgroundColor: colors.bgSurface,
  },
  tabItemDisabled: {
    backgroundColor: colors.bgDefaultWeak,
  },
  tabLabel: {
    ...typo.labelSmall,
    color: colors.fgPlaceholder,
  },
  tabLabelActive: {
    color: colors.fgNeutral,
  },
  tabLabelDisabled: {
    color: colors.fgDisabled,
  },
});
