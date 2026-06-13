import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TapButtonItem from './TapButtonItem';
import { gap } from '../styles/token';

export default function TapButton({ tabs = [], defaultKey, onTabChange, style }) {
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
          <TapButtonItem
            key={tab.key}
            icon={tab.icon}
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
    gap: gap.S,
  },
});
