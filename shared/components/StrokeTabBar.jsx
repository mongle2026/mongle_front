import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StrokeTabItem from './StrokeTabItem';
import { padding } from '../styles/token';

export default function StrokeTabBar({ tabs = [], defaultKey, onTabChange, style }) {
  const [activeKey, setActiveKey] = useState(defaultKey ?? tabs[0]?.key);

  const handlePress = (key) => {
    setActiveKey(key);
    onTabChange?.(key);
  };

  const activeTab = tabs.find((tab) => tab.key === activeKey);

  return (
    <View style={style}>
      <View style={styles.bar}>
        {tabs.map((tab) => (
          <StrokeTabItem
            key={tab.key}
            label={tab.label}
            isActive={tab.key === activeKey}
            onPress={() => handlePress(tab.key)}
          />
        ))}
      </View>
      {activeTab?.content}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingBottom: padding.M,
  },
});
