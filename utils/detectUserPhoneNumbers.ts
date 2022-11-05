import DeviceNumber from 'react-native-device-number';
import normalisePhoneNumber from './normalisePhoneNumber';

/**
 * Detects user's phone number(s) during top-up and prompts
 * him a dialog to select number for top-up.\
 * It returns a normalised phone number according to user's selection.
 *
 * **Incase of errors during detection, this function fails gracefully**.
 * @return {Promise<string>} User selected phone number
 */
const detectUserPhoneNumbers = async (): Promise<string | void> => {
  // TODO: optimise function
  try {
    const {mobileNumber}: {mobileNumber: string} = await DeviceNumber.get();
    return normalisePhoneNumber(mobileNumber);
  } catch (error) {
    // does nothing. fails gracefully
  }
};

export default detectUserPhoneNumbers;
