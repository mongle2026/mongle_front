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
  iconColor = colors.fgLayerNeutralWeak,
  style,
}) {
  const hasValue = value.length > 0;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <SearchIcon width={20} height={20} color={iconColor} />

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
    padding: padding.XL,
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.L,
    paddingVertical: 0,
    gap: gap.M,
    borderRadius: radius.XS,
    backgroundColor: colors.bgLayerDefault,
  },
  input: {
    flex: 1,
    height: 39,
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