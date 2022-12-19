//import libraries
import React, {useId, useRef} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import * as Animatable from 'react-native-animatable';
import CloseIcon from '~images/close.svg';

interface TxReceiptOverlayProps {
  /**
   * Whether overlay is visible
   */
  visible?: boolean;
  /**
   * Title text of the overlay e.g 'Wallet Withdrawal'
   */
  title: string;
  /**
   * Subtitle text of the overlay. Appears under the title
   */
  subTitle?: string;
  /**
   * Function called when overlay is closed.
   * The function is called after the closing animation and should set the visibility
   * of the overlay via `visible` prop
   */
  onClose: () => void;
  /**
   * An object which describes the receipt info. Each field in the object describes a segment of the receipt info.
   * In the overlay, the keys will be rendered as text to the left, and values to the right
   * @example
   * ```tsx
   * let data = {
   *   Status: "Successful",
   *   "Transaction ID": "123abc"
   * }
   *
   * <TxRceiptOverlay receiptData={data} visible={true} />
   *
   * ```
   */
  receiptData: {
    [receiptFieldName: string]: string | number;
  };
}

/**
 * Renders individual receipt detail
 */
interface InfoItemProps {
  /** text to the left */
  label: string;
  /** text to the right */
  value: string | number;
}
export const InfoItem = ({label, value}: InfoItemProps) => (
  <View style={tw`flex-row justify-between my-3`}>
    <Text type="caption" color="gray">
      {label}
    </Text>
    <Text type="caption" color="black">
      {value}
    </Text>
  </View>
);

// TxReceiptOverlay component for showing transaction receipt info in an overlay
const TxReceiptOverlay = ({
  onClose,
  receiptData,
  title,
  subTitle,
  visible = false,
}: TxReceiptOverlayProps) => {
  const viewRef = useRef<Animatable.View>();
  const id = useId();

  if (!visible) return null;
  return (
    <Animatable.View
      animation={'slideInUp'}
      duration={500}
      // @ts-ignore
      ref={viewRef}
      style={tw`p-4 absolute inset-0 bg-gray5`}>
      <TouchableOpacity
        onPress={() => {
          viewRef.current
            ?.fadeOutDownBig?.(500)
            .then(v => v.finished && onClose());
        }}
        activeOpacity={0.8}
        style={tw.style(`bg-white rounded-full p-2.5 shadow-xl w-11 h-11`)}>
        <CloseIcon width="100%" height="100%" />
      </TouchableOpacity>
      <Text type="title" color="black" style={tw`mt-6`}>
        {title}
      </Text>
      {subTitle ? (
        <Text type="caption" color="gray">
          {subTitle}
        </Text>
      ) : null}

      <View style={tw`rounded-md bg-white shadow-md p-4 mt-8`}>
        {Object.entries(receiptData).map((data, idx) => (
          <InfoItem key={idx + id} label={data[0]} value={data[1]} />
        ))}
      </View>
    </Animatable.View>
  );
};

export default TxReceiptOverlay;
