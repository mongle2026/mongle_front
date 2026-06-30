import { View, TextInput, StyleSheet, Platform } from 'react-native';

import SearchIcon from '../../assets/icons/ic_search.svg';
import { colors } from '../styles/color';
import { padding, gap, radius } from '../styles/token';

export default function SearchField({
  value = '',
  onChangeText,
  onFocus,
  placeholder = '검색어',
  editable = true,
  onLayout,
  style,
}) {
  const hasValue = value.length > 0;
  const resolvedIconColor = hasValue ? colors.fgLayerNeutral : colors.fgPlaceholder;

  return (
    <View style={[styles.wrapper, style]} onLayout={onLayout}>
      <View style={styles.container}>
        <SearchIcon width={20} height={20} color={resolvedIconColor} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={colors.fgPlaceholder}
          editable={editable}
          multiline={false}
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
    paddingTop: padding.XL,
    paddingBottom: padding.M,
    paddingHorizontal: padding.XL,
    backgroundColor: colors.bgLayerDefault,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.XL,
    paddingVertical: padding.L,
    gap: gap.M,
    borderRadius: radius.M,
    backgroundColor: colors.bgLayerWeak,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.fgLayerNeutral,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 1 : 0,
  },
  inputEmpty: {
    color: colors.fgPlaceholder,
  },
  inputFilled: {
    color: colors.fgLayerNeutral,
  },
});
