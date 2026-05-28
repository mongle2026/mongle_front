import { View, TextInput, StyleSheet } from 'react-native';

import SearchIcon from '../../assets/icons/ic_search.svg';
import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';
import { typo } from '../styles/typo';

export default function SearchField({
  value = '',
  onChangeText,
  onFocus,
  placeholder = '검색어',
  editable = true,
  style,
}) {
  const hasValue = value.length > 0;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <SearchIcon width={20} height={20} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.fgPlaceholder}
          editable={editable}
          style={[
            styles.input,
            hasValue ? styles.inputFilled : styles.inputEmpty,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: padding.XL,
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    minHeight: 39,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.L,
    paddingVertical: padding.M,
    gap: gap.M,
    borderRadius: radius.XS,
    backgroundColor: colors.bgLayerDefault,
  },
  input: {
    flex: 1,
    height: 23,
    padding: 0,
    margin: 0,
    ...typo.bodyMedium,
  },
  inputEmpty: {
    color: colors.fgPlaceholder,
  },
  inputFilled: {
    color: colors.fgLayerNeutral,
  },
});