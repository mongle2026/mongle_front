// 유경 생성

import { useState } from 'react';

export const TABS = [
  { key: 'template', label: '템플릿' },
  { key: 'pattern',  label: '패턴' },
  { key: 'color',    label: '컬러' },
  { key: 'stamp',    label: '우표' },
];

export const MOCK_DATA = {
  template: Array.from({ length: 6 }, (_, i) => ({ id: `t${i}`, label: `추천 템플릿${i + 1}` })),
  pattern:  Array.from({ length: 9 }, (_, i) => ({ id: `p${i}` })),
  color: [
    { id: 'c0', value: '#FF6B6B' },
    { id: 'c1', value: '#4ECDC4' },
    { id: 'c2', value: '#45B7D1' },
    { id: 'c3', value: '#96CEB4' },
    { id: 'c4', value: '#FFEAA7' },
    { id: 'c5', value: '#DDA0DD' },
  ],
  stamp: Array.from({ length: 9 }, (_, i) => ({ id: `s${i}` })),
};

export default function UseLetterCoverSelect() {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedItems, setSelectedItems] = useState({
    template: null,
    pattern: null,
    color: null,
    stamp: null,
  });
  const [isFront, setIsFront] = useState(true);

  const handleTabPress = (key) => setActiveTab(key);

  const handleSelectItem = (itemId) =>
    setSelectedItems(prev => ({ ...prev, [activeTab]: itemId }));

  const handleFlip = () => setIsFront(prev => !prev);

  const isNextEnabled = Object.values(selectedItems).every(v => v !== null);

  return {
    activeTab,
    selectedItems,
    isFront,
    handleTabPress,
    handleSelectItem,
    handleFlip,
    isNextEnabled,
  };
}
