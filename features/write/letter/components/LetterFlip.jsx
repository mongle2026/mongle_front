import { useRef, useEffect } from 'react';
import { View } from 'react-native';

// TODO: Expo Dev Client 빌드 시 아래 주석 해제 후 placeholder 제거
// import { useRive, Fit, Alignment } from 'rive-react-native';

export default function LetterFlip({ isFront, recipientImg, senderImg, stamp }) {
  // TODO: Rive 연결
  // const { rive, RiveComponent } = useRive({
  //   resourceName: 'letterFlipAnimation',
  //   stateMachineName: 'State Machine',
  //   autoplay: true,
  // });

  // const prevIsFront = useRef(isFront);
  // useEffect(() => {
  //   if (prevIsFront.current !== isFront) {
  //     rive?.fireState('State Machine', 'flip');
  //     prevIsFront.current = isFront;
  //   }
  // }, [isFront, rive]);

  return (
    <View style={{ width: 280, height: 210, backgroundColor: '#34373a', borderRadius: 6 }} />
  );
}
