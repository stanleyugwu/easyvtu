//import libraries
import React, {useState} from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Modal,
  Linking,
} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import ContactsIcon from '~images/contact.svg';
import {selectContactPhone} from 'react-native-select-contact';
import normalisePhoneNumber from '../utils/normalisePhoneNumber';
import CloseIcon from '~images/close.svg';
import Button from './Button';

interface ContactSelectorProps {
  /**
   * Function to be called with selected contact's phone number
   */
  onSelect: (selectedNumber: string) => void;
}

/**
 * Contact selector component for selecting a contact for top-up.
 * It handles permissions
 */
const ContactSelector = ({onSelect}: ContactSelectorProps) => {
  /**
   * determines the action to take for contact permission prompt
   * depending on whether the user denied permission temporary or
   * permanently (never ask again)
   */
  const [permissionRetryMode, setPermissionRetryMode] = useState<
    undefined | 're-prompt' | 'settings'
  >(undefined);

  // handles pcking contact for top-up
  const handlePickContact = React.useCallback(async () => {
    try {
      // on android we need to explicitly request for contacts permission
      if (Platform.OS === 'android') {
        const request = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );

        // denied permission
        if (request === PermissionsAndroid.RESULTS.DENIED)
          return setPermissionRetryMode('re-prompt');
        // never ask again
        else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
          return setPermissionRetryMode('settings');
      }

      // permission granted
      // initiate contact picking.
      // checks above have early returns so we're sure below
      // block will only be run on iOS or if android permission is granted
      const selectedContact = await selectContactPhone();
      let number = selectedContact?.selectedPhone?.number;
      if (number) {
        number = normalisePhoneNumber(number);
        onSelect?.(number);
      }
    } catch (error) {
      // on android, let's show error via Toast,
      // we do nothing here if on iOS
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          'Contact Selection Failed',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    }
  }, []);

  return (
    <>
      <ContactsIcon
        style={tw.style(
          `mx-4`,
          Platform.OS !== 'ios' && Platform.OS !== 'android' && 'hidden',
        )}
        onPress={handlePickContact}
      />
      <Modal
        style={tw`h-full`}
        animationType="fade"
        onDismiss={() => setPermissionRetryMode(undefined)}
        onRequestClose={() => setPermissionRetryMode(undefined)}
        transparent
        visible={permissionRetryMode !== undefined}>
        <View
          style={tw`h-full bg-dark bg-opacity-80 justify-center items-center`}>
          <View style={tw`p-4 rounded-lg bg-white mx-2`}>
            <CloseIcon
              style={tw`self-end`}
              onPress={() => setPermissionRetryMode(undefined)}
            />
            <Text type="subTitle" style={tw`text-center mt-4`}>
              You need to grant permission
            </Text>
            <Text style={tw`text-center mt-2 mb-6`}>
              Without granting contacts permission, you won't be able to select
              a contact for top-up. Click below button and
              {permissionRetryMode === 're-prompt'
                ? ' grant permission when prompted'
                : ' grant EasyVtu Contact permission from settings'}
            </Text>
            <Button
              label="Grant Permission"
              onPress={() => {
                permissionRetryMode === 're-prompt'
                  ? handlePickContact()
                  : Linking.openSettings();
                setPermissionRetryMode(undefined);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(ContactSelector, () => true);
