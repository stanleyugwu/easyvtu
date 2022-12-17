//import libraries
import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import InputField from '~components/InputField';
import DropMenuFieldButton from '~components/DropMenuFieldButton';
import Button from '~components/Button';
import WalletBalance from '~components/WalletBalance';
import ElectricitySchema from './electricity.schema';
import {useForm} from 'react-hook-form';
import {InferType} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import useAppStore from '../../store';
import {useQuery} from 'react-query';
import _axios from '../../api/axios';
import {ElectricityProviderName} from './providerImageIds';
import ElectricityProvidersBottomSheet from './ProvidersBottomSheet';
import SnackBar from '~components/SnackBar';
import getFirstError from '../../utils/getFirstError';
import PaymentBottomSheet from '~components/PaymentBottomSheet';
import FlutterwaveInitError from 'flutterwave-react-native/dist/utils/FlutterwaveInitError';
import Loader from '~components/Loader';
import _topUpElectricity from '../../api/services/topUpElectricity';
import SuccessOverlay from '~components/SuccessOverlay';
import {RedirectParams} from 'flutterwave-react-native/dist/PayWithFlutterwave';
import constants from '../../utils/constants';
import reduceWalletBalanceBy from '../../utils/reduceWalletBalance';
import requestInAppReview from '../../utils/requestInAppReview';

type ElectricitySchemaFields = InferType<typeof ElectricitySchema>;

// Electricity Screen Component
const Electricity = () => {
  const profile = useAppStore(state => state?.profile);
  const [providerMenuVisible, setProviderMenuVisible] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [paymentBottomSheetVisible, setPaymentBottomSheetVisible] =
    useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | undefined>(undefined);

  /**
   * Caches form values before flutterwave initialisation
   */
  const cachedFormValues = useRef<ElectricitySchemaFields | null>();

  /**
   * Query for retreiving electricity providers
   */
  const providerQuery = useQuery('providers', () =>
    _axios.get<ElectricityProviderName[]>('/get_disco'),
  );

  /**
   * Form validation manager
   */
  const form = useForm<ElectricitySchemaFields>({
    resolver: yupResolver(ElectricitySchema),
    defaultValues: {
      phoneNumber: profile?.phone,
      emailAddress: profile?.email,
    },
  });

  /**
   * Shareable wrapper for electricity top-up API service.
   * This wrapper contains common side effects for wallet and flutterwave
   * payment while allowing for extension via promise.
   */
  const topUpElectricity = React.useCallback(
    async (
      values: Parameters<typeof _topUpElectricity>['0'],
      errorMsg?: string,
    ) => {
      // payment successful, let's hit server
      setLoaderVisible(true);
      try {
        const res = await _topUpElectricity(values);
        // top-up complete
        setSuccessMsg('Electricity top-up transaction successful'); // show success overlay
        return res;
      } catch (error: any) {
        // Edge case. Error when hitting server to release service paid for.
        setRequestError(errorMsg || error.message);
      } finally {
        setPaymentBottomSheetVisible(false);
        cachedFormValues.current = null;
        setLoaderVisible(false);
      }
    },
    [],
  );

  /**
   * Handles form submission
   */
  const handleBuyElectricity = form.handleSubmit(values => {
    setPaymentBottomSheetVisible(true);
  });

  /**
   **************************
   * PAYMENT HANDLERS
   **************************
   */
  const handleFlutterwaveInitError = (error: FlutterwaveInitError) => {
    cachedFormValues.current = null;
    setRequestError('Flutterwave payment initialisation failed');
  };

  const handleWalletPayment = async () => {
    const values = form.getValues();
    const balance = profile?.wallet_balance;

    // assert funds sufficiency
    if (balance && typeof +balance === 'number' && +balance >= values.amount) {
      // fund is sufficient
      setPaymentBottomSheetVisible(false); // close payment bottom sheet
      setLoaderVisible(true); // show loader overlay
      topUpElectricity(values).then(res =>
        reduceWalletBalanceBy(values.amount),
      );
    } else {
      // fund insufficient
      setRequestError('Insufficient wallet funds');
      return;
    }
  };

  const handleFlutterwaveRedirect = React.useCallback(
    (data: RedirectParams) => {
      if (data.status === 'successful') {
        const values = cachedFormValues.current!;
        topUpElectricity(values, constants.FAULTY_TX_MSG);
      } else {
        // payment failed
        cachedFormValues.current = null;
        setRequestError('Flutterwave payment failed');
      }
    },
    [cachedFormValues.current],
  );

  return (
    <>
      <SafeAreaScrollView backgroundColor="white">
        <AppHeader
          title="Buy Electricity"
          subTitle="Pay electricity bills for yourself, your family and friends without hassles"
        />

        <View style={tw`mt-6`}>
          <Text type="paragraph" color="black" style={tw`mb-2`}>
            Electricity provider
          </Text>
          <DropMenuFieldButton
            label={
              form.getValues('provider')?.concat(' ELECTRICITY') ||
              'Select a provider'
            }
            onPress={() => setProviderMenuVisible(true)}
          />

          <View style={tw`mt-2`} collapsable />
          <InputField
            label="Meter number"
            placeholder="Enter your meter number"
            keyboardType="number-pad"
            onChangeText={text => form.setValue('meterNumber', text)}
          />
          <InputField
            label="Amount"
            placeholder="Amount"
            keyboardType="number-pad"
            onChangeText={text => form.setValue('amount', +text)}
          />
          <WalletBalance />
          <View style={tw`m-1`} collapsable />

          <InputField
            label="Phone Number"
            placeholder={'Enter phone number'}
            onChangeText={text => form.setValue('phoneNumber', text)}
            defaultValue={profile?.phone}
          />
          <InputField
            label="Email Address"
            placeholder={'Enter email address'}
            onChangeText={text => form.setValue('emailAddress', text)}
            defaultValue={profile?.email}
          />

          <Button
            label="Buy Electricity"
            style={tw`mt-4`}
            onPress={handleBuyElectricity}
          />
        </View>
      </SafeAreaScrollView>
      <ElectricityProvidersBottomSheet
        visible={providerMenuVisible}
        onDismiss={() => setProviderMenuVisible(false)}
        queryInterface={providerQuery}
        onSelect={selectedProvider => {
          setProviderMenuVisible(false);
          form.setValue('provider', selectedProvider.toUpperCase());
        }}
      />
      <PaymentBottomSheet
        visible={paymentBottomSheetVisible}
        amount={form.getValues('amount') || 0}
        handleFlutterwaveRedirect={handleFlutterwaveRedirect}
        handleWalletPayment={handleWalletPayment}
        handleFlutterwaveInitError={handleFlutterwaveInitError}
        onFlutterwaveInit={() => (cachedFormValues.current = form.getValues())}
        service="electricity"
        onDismiss={() => setPaymentBottomSheetVisible(false)}
      />
      <SnackBar
        text={getFirstError(form.formState.errors) || requestError}
        onDismiss={() => {
          form.clearErrors(), setRequestError('');
        }}
        timeOut={requestError ? 5000 : undefined}
      />
      <Loader visible={loaderVisible} />
      <SuccessOverlay
        visible={!!successMsg}
        successText={successMsg}
        onDismiss={() => {
          setSuccessMsg(undefined);
          form.reset();
          requestInAppReview();
        }}
      />
    </>
  );
};

export default Electricity;
