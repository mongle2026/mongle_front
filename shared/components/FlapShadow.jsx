import Svg, { Path, Defs, Filter, FeGaussianBlur } from 'react-native-svg';

// shadow.middleDown: shadowOffset y=4, shadowRadius=15, shadowOpacity=0.2, shadowColor=#000
// stdDeviation ≈ shadowRadius / 2 = 7.5
const FLAP_PATH = 'M311.63,148.09l5.45,17.35H8.09l2.59-10.4c2.86-11.49,9.11-21.85,17.93-29.74L158.96,8.78c1.5-1.34,3.76-1.36,5.29-.04l129.74,112.46c8.26,7.16,14.36,16.46,17.64,26.89Z';

export default function FlapShadow({ width, height }) {
  return (
    <Svg
      width={width}
      height={height + 30}
      viewBox="0 -30 325.17 233.2"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Defs>
        <Filter id="flapShadow" x="-10%" y="-20%" width="120%" height="160%">
          <FeGaussianBlur stdDeviation="7.5" />
        </Filter>
      </Defs>
      <Path
        d={FLAP_PATH}
        fill="rgba(0,0,0,0.2)"
        transform="rotate(180, 162.585, 86.6) translate(0, -4)"
        filter="url(#flapShadow)"
      />
    </Svg>
  );
}
