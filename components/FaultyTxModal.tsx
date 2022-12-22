//import libraries
import React, {useState} from 'react';
import Text from '~components/Text';
import tw from '../lib/tailwind';
import BottomSheet, {BOTTOMSHEETHEIGHT} from './BottomSheet';
import Clipboard from '@react-native-clipboard/clipboard';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList} from '../navigation/screenParams';

interface FaultyTxModalProps {
  /**
   * The transaction ref to display.
   * This determines the visibility of the component
   */
  txRef?: string;

  /**
   * Function to be called when modal is dismissed
   */
  onDismiss: () => void;
}

const FAULTY_TX_MSG = `Payment was successful but top-up failed due to slow internet connection. Copy below transaction id, then you'll redirected to contact our customer care and complete top-up. Please keep the copied transaction id safe`;

/**
 * Displays modal for faulty transactions i.e transactions where payment
 * was successful but top-up completion failed for some reason.
 * It shows the `transaction ref` to user, so user can copy it and resolve issue
 * with customer care
 */
const FaultyTxModal = ({txRef, onDismiss}: FaultyTxModalProps) => {
  const [txRefCopied, setTxRefCopied] = useState(false);
  const {navigate} = useNavigation<NavigationProp<StackParamList>>();

  const handleCopyId = () => {
    Clipboard.setString(txRef!);
    setTxRefCopied(true);
    setTimeout(() => navigate('Support'), 1000);
  };

  const noop = () => null;

  return (
    <BottomSheet
      height={BOTTOMSHEETHEIGHT.THREE_QUATER}
      visible={!!txRef}
      onDismiss={txRefCopied ? onDismiss : noop}
      title={"An error occurred, top-up couldn't complete"}>
      <Text style={tw`text-center`}>{FAULTY_TX_MSG}</Text>
      <Text
        onPress={handleCopyId}
        type="small"
        style={tw`mt-4 bg-gray5 text-center p-3 rounded-md`}>
        {txRef}
      </Text>
      <Text
        onPress={handleCopyId}
        style={tw.style(
          `mx-auto p-2 px-6 rounded-md text-white mt-4`,
          txRefCopied ? 'bg-green-500' : 'bg-primary',
        )}>
        {txRefCopied ? 'TRANSACTION ID COPIED' : 'COPY'}
      </Text>
    </BottomSheet>
  );
};

export default FaultyTxModal;
