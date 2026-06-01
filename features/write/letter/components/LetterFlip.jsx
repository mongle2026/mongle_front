import { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useRive, Fit, Alignment } from 'rive-react-native';

export default function LetterFlip({ isFront, recipientImg, senderImg, stamp }) {
  const { rive, RiveComponent } = useRive({
    resourceName: 'letterFlipAnimation',
    stateMachineName: 'State Machine',
    autoplay: true,
  });

  const prevIsFront = useRef(isFront);
  useEffect(() => {
    if (prevIsFront.current !== isFront) {
      rive?.fireState('State Machine', 'flip');
      prevIsFront.current = isFront;
    }
  }, [isFront, rive]);

  // TODO: recipientImg, senderImg, stamp → Rive 이미지 주입

  return (
    <View style={{ width: 280, height: 210 }}>
      <RiveComponent
        fit={Fit.Contain}
        alignment={Alignment.Center}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
