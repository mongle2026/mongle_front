// 유경 생성

import { useState } from 'react';
import { PATTERNS, STAMPS, TEMPLATES, resolvePatternColor } from '../data/letterCoverData';

export const TABS = [
  { key: 'template', label: '템플릿' },
  { key: 'pattern',  label: '패턴' },
  { key: 'color',    label: '컬러' },
  { key: 'stamp',    label: '우표' },
];

// 기본값: 각 배열의 첫 번째 항목
const DEFAULT_PATTERN = PATTERNS[0];
const DEFAULT_COLOR   = PATTERNS[0].colors[0];
const DEFAULT_STAMP   = STAMPS[0];

export default function UseLetterCoverSelect() {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedItems, setSelectedItems] = useState({
    template: null,
    patternId: DEFAULT_PATTERN.id,
    colorId:   DEFAULT_COLOR.id,
    stampId:   DEFAULT_STAMP.id,
  });
  // 현재 선택된 패턴의 컬러 목록
  const selectedPattern = PATTERNS.find(p => p.id === selectedItems.patternId) ?? DEFAULT_PATTERN;
  const currentColors   = selectedPattern.colors;

  const handleTabPress = (key) => setActiveTab(key);

  const handleSelectPattern = (patternId) => {
    const pattern = PATTERNS.find(p => p.id === patternId);
    setSelectedItems(prev => ({
      ...prev,
      template: null,          // 템플릿 선택 해제
      patternId,
      colorId: pattern.colors[0].id, // 해당 패턴의 기본 컬러로 리셋
    }));
  };

  const handleSelectColor = (colorId) => {
    setSelectedItems(prev => ({ ...prev, template: null, colorId }));
  };

  const handleSelectStamp = (stampId) => {
    setSelectedItems(prev => ({ ...prev, template: null, stampId }));
  };

  // 템플릿 선택 → 패턴/컬러/우표 한번에 세팅
  const handleSelectTemplate = (templateId) => {
    const tmpl = TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    const resolved = resolvePatternColor(tmpl.patternColorId);
    if (!resolved) return;

    setSelectedItems({
      template: templateId,
      patternId: resolved.pattern.id,
      colorId:   resolved.color.id,
      stampId:   tmpl.stampId,
    });
  };

  const handleSelectItem = (itemId) => {
    switch (activeTab) {
      case 'template': return handleSelectTemplate(itemId);
      case 'pattern':  return handleSelectPattern(itemId);
      case 'color':    return handleSelectColor(itemId);
      case 'stamp':    return handleSelectStamp(itemId);
    }
  };

  // 패턴/컬러/우표가 모두 선택된 경우 다음 활성화
  const isNextEnabled = !!(selectedItems.patternId && selectedItems.colorId && selectedItems.stampId);

  return {
    activeTab,
    selectedItems,
    currentColors,
    handleTabPress,
    handleSelectItem,
    isNextEnabled,
  };
}
