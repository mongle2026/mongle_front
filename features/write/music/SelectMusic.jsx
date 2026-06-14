import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import SearchField from '../../../shared/components/SearchField';
import ListHeader from '../../../shared/components/ListHeader';
import ListRow from '../components/ListRow';
import BottomSheet from '../../../shared/components/BottomSheet';
import { colors } from '../../../shared/styles/color';
import { padding, radius } from '../../../shared/styles/token';

import UseSelectMusic from './hook/UseSelectMusic';

export default function SelectMusic({ visible, onClose, searchPlaceholder = '기록할 음악을 검색해 주세요.' }) {
  const [searchFieldHeight, setSearchFieldHeight] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const {
    keyword,
    musicList,
    popularMusicList,
    selectedMusicId,
    handleChangeKeyword,
    handleFocusSearch,
    handleSelectMusic,
  } = UseSelectMusic(null, onClose);

  const displayMusicList = !keyword.trim()
    ? popularMusicList
    : musicList;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <SearchField
          value={keyword}
          onChangeText={handleChangeKeyword}
          onFocus={handleFocusSearch}
          placeholder={searchPlaceholder}
          onLayout={e => setSearchFieldHeight(e.nativeEvent.layout.height)}
        />

        <ScrollView
          style={styles.list}
          bounces={!!keyword.trim()}
          onScroll={e => setScrolled(e.nativeEvent.contentOffset.y > 0)}
          scrollEventThrottle={16}
        >
          {!keyword.trim() && (
            <ListHeader title="Apple Music 인기곡 10곡" />
          )}
          <View style={styles.listContainer}>
            {displayMusicList.map(item => (
              <ListRow
                key={item.externalId}
                title={item.musicTitle}
                subtitle={item.musicArtist}
                imageSource={item.musicArtwork}
                img="music"
                caption
                selected={selectedMusicId === item.externalId}
                onPress={() => handleSelectMusic(item.externalId)}
              />
            ))}
          </View>
        </ScrollView>

        {scrolled && (
          <LinearGradient
            colors={[colors.bgLayerDefault, colors.bgLayerDefault + '00']}
            style={[styles.gradient, { top: searchFieldHeight }]}
            pointerEvents="none"
          />
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    borderRadius: radius.XS,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: padding.XL,
    zIndex: 1,
  },
});
