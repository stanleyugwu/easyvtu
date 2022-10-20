//import libraries
import React from 'react';
import {ViewProps} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import * as Animatable from 'react-native-animatable';

interface SnackBarProps extends ViewProps {
  /**
   * Text to render in snackbar.
   * This also determines the visibility of the component, passing empty or
   * no text will make the component hidden
   */
  text?: string;

  /**
   * Time in seconds after which `onDismiss` function which should reset the `visible` prop will be called
   */
  timeOut?: number;

  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void;
}

/**
 * Snackbar component
 */
const SnackBar = ({
  text,
  onDismiss,
  timeOut = 3000,
  ...otherProps
}: SnackBarProps) => {
  const textValid = !!text?.trim?.()?.length;
  const [hidden, setHidden] = React.useState(true);
  const animatableRef = React.useRef(null);
  const hideTimeout = React.useRef<number | undefined>(undefined);

  // Clears timeout when component is unmounted
  React.useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // determines component visibility from visible prop
  React.useLayoutEffect(() => {
    if (textValid) {
      // show
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      setHidden(false);
      hideTimeout.current = setTimeout(onDismiss, timeOut);
    } else {
      // hide
      if (hideTimeout.current) clearTimeout(hideTimeout.current);

      // if possible, adds slide out animation when component is hidden
      // @ts-ignore
      if (animatableRef.current?.slideOutDown) {
        // @ts-ignore
        (animatableRef.current?.slideOutDown(600) as Promise<void>)?.then(() =>
          setHidden(true),
        );
      } else setHidden(true);
    }
  }, [textValid]);

  // render nothing when no visible
  if (hidden) return null;

  return (
    <Animatable.View
      style={tw`absolute z-40 bottom-0 bg-dark right-0 left-0 p-4`}
      animation="slideInUp"
      duration={300}
      ref={animatableRef}
      {...otherProps}>
      <Text type="caption" color="gray5">
        {text}
      </Text>
    </Animatable.View>
  );
};

export default SnackBar;
