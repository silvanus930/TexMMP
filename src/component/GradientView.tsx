import React, {FunctionComponent} from 'react';
import LinearGradient from 'react-native-linear-gradient';

type GradientViewProps = {
  style?: any;
  children?: any;
};
const GradientView: FunctionComponent<GradientViewProps> = (
  props: GradientViewProps,
) => {
  const {children, style} = props;
  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;
  return (
    <LinearGradient
      colors={['#02BE9A', '#00DF8F']}
      start={{x: 0.424, y: 0.485}}
      end={{x: 0.995, y: 0.87}}
      locations={[0.101, 0.733]}
      style={{...passedStyles}}>
      {children}
    </LinearGradient>
  );
};

export default GradientView;
