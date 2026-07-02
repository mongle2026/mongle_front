import MusicInfo from './MusicInfo';
import useMusicPlayer from './useMusicPlayer';

export default function Music({
  title,
  artist = '가수명',
  imageSource,
  audioUri,
  musicId,
  activeMusicId,
  onChangeActiveMusic,
  button = false,
  empty = false,
  onPress,
  buttonStyle,
  style,
}) {
  const {
    isPlaying,
    toggle,
  } = useMusicPlayer({
    audioUri,
    musicId,
    activeMusicId,
    onChangeActiveMusic,
  });

  return (
    <MusicInfo
      title={title}
      artist={artist}
      imageSource={imageSource}
      isPlaying={isPlaying}
      button={button}
      empty={empty}
      onPress={onPress}
      onPressButton={toggle}
      buttonStyle={buttonStyle}
      style={style}
    />
  );
}