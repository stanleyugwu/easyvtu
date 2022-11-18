//import libraries
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import tw from '../lib/tailwind';
import CarrierSelector from './CarrierSelector';
import ContactSelector from './ContactSelector';
import InputField from './InputField';
import {Carrier} from '../screens/airtime/airtime';
import detectUserPhoneNumbers from '../utils/detectUserPhoneNumbers';
import detectCarrierFromPhoneNumber from '../utils/detectCarrierFromPhoneNumber';

type NumberAndCarrier = [phone: string, carrier?: Carrier];
interface CarrierAndPhoneNumberFieldProps {
  /**
   * Function to be called with updated phone number and carrier network,
   * when phone number value changes in the field.
   * 
   * @param {NumberAndCarrier} updatedNumberAndCarrier - tuple of updated phone number and carrier
   */
  onPhoneChange: (updatedCarrierAndNumber: NumberAndCarrier) => void;
}

/**
 * This is just a convenient, decoupled, composite component for
 * phone number and carrier selection form fields
 */
const CarrierAndPhoneNumberField = ({
  onPhoneChange,
}: CarrierAndPhoneNumberFieldProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carrier, setCarrier] = useState<Carrier | undefined>(undefined);

  // facilitates detecting user's phone number
  const detectNumber = useCallback(async () => {
    try {
      const selectedNumber = await detectUserPhoneNumbers();
      if (selectedNumber && selectedNumber.length > 0)
        setPhoneNumber(selectedNumber);
    } catch (error) {
      // nothing should be thrown here, but just incase something
      // is thrown, let's swallow it
    }
  }, []);

  // runs on phone number update
  useEffect(() => {
    const detectedCarrier = detectCarrierFromPhoneNumber(phoneNumber);
    if (detectedCarrier) setCarrier(detectedCarrier);

    onPhoneChange?.([phoneNumber, detectedCarrier]);
  }, [phoneNumber]);

  // runs on mount to detect user's phone numbers
  useEffect(() => {
    detectNumber();
  }, []);

  return (
    <>
      <InputField
        label="Phone Number"
        placeholder="Receipient phone number"
        rightElement={
          <ContactSelector
            onSelect={selectedNumber => setPhoneNumber(selectedNumber)}
          />
        }
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        value={phoneNumber}
        onChangeText={value => setPhoneNumber(value)}
      />
      <View style={tw`mt-6 mb-4`}>
        <CarrierSelector selected={carrier} />
      </View>
    </>
  );
};

export default CarrierAndPhoneNumberField;
