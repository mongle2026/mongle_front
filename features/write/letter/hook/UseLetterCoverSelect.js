// 유경 생성

import { useState, useEffect } from 'react';
import { PATTERNS, STAMPS, TEMPLATES, resolvePatternColor, useLetterCoverStore } from '../data/letterCoverData';

export const TABS = [
  { key: 'template', label: '템플릿' },
  { key: 'pattern', label: '패턴' },
  { key: 'color', label: '컬러' },
  { key: 'stamp', label: '우표' },
];

function randomTemplate() {
  const tmpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  const resolved = resolvePatternColor(tmpl.patternColorId);
  return {
    template: tmpl.id,
    patternId: resolved.pattern.id,
    colorId: resolved.color.id,
    stampId: tmpl.stampId,
  };
}

export default function UseLetterCoverSelect() {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedItems, setSelectedItems] = useState(randomTemplate);
  // 현재 선택된 패턴의 컬러 목록
  const selectedPattern = PATTERNS.find(p => p.id === selectedItems.patternId) ?? PATTERNS[0];
  const currentColors = selectedPattern.colors;

  // 초기 랜덤 템플릿을 스토어에 반영
  const setEnvelope = useLetterCoverStore((state) => state.setEnvelope);
  useEffect(() => {
    setEnvelope({ patternId: selectedItems.patternId, colorId: selectedItems.colorId, stampId: selectedItems.stampId });
  }, []);
  const setPattern = useLetterCoverStore((state) => state.setPatternId);
  // eslint-disable-next-line no-unused-vars
  const setColor = useLetterCoverStore((state) => state.setColorId);
  const setStamp = useLetterCoverStore((state) => state.setStampId);

  const handleTabPress = (key) => setActiveTab(key);

  const handleSelectPattern = (patternId) => {
    const pattern = PATTERNS.find(p => p.id === patternId);
    setSelectedItems(prev => ({
      ...prev,
      template: null,          // 템플릿 선택 해제
      patternId,
      colorId: pattern.colors[0].id, // 해당 패턴의 기본 컬러로 리셋
    }));
    setPattern(patternId);
    setColor(pattern.colors[0].id);
  };

  const handleSelectColor = (colorId) => {
    setSelectedItems(prev => ({ ...prev, template: null, colorId }));
    setColor(colorId);
  };

  const handleSelectStamp = (stampId) => {
    setSelectedItems(prev => ({ ...prev, template: null, stampId }));
    setStamp(stampId);
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
      colorId: resolved.color.id,
      stampId: tmpl.stampId,
    });

    setEnvelope({
      patternId: resolved.pattern.id,
      colorId: resolved.color.id,
      stampId: tmpl.stampId,
    });
  };

  const handleSelectItem = (itemId) => {
    switch (activeTab) {
      case 'template': return handleSelectTemplate(itemId);
      case 'pattern': return handleSelectPattern(itemId);
      case 'color': return handleSelectColor(itemId);
      case 'stamp': return handleSelectStamp(itemId);
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
