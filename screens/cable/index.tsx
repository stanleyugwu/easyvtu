//import libraries
import React, {useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {useQueries} from 'react-query';
import {yupResolver} from '@hookform/resolvers/yup';
import {RedirectParams} from 'flutterwave-react-native/dist/PayWithFlutterwave';

import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import DropMenuFieldButton from '~components/DropMenuFieldButton';
import Text from '~components/Text';
import WalletBalance from '~components/WalletBalance';
import InputField from '~components/InputField';
import Button from '~components/Button';
import SnackBar from '~components/SnackBar';
import Loader from '~components/Loader';
import SuccessOverlay from '~components/SuccessOverlay';
import PaymentBottomSheet from '~components/PaymentBottomSheet';
import CableSelector, {CableNetwork} from './CableSelector';
import CableNetworksBottomSheet from './CableNetworksBottomSheet';

import constants from '../../utils/constants';
import getFirstError from '../../utils/getFirstError';
import balanceIsSufficient from '../../utils/balanceIsSufficient';
import reduceWalletBalanceBy from '../../utils/reduceWalletBalance';

import _axios from '../../api/axios';
import getServicePlans from '../../api/services/getServicePlans';
import _topUpCable from '../../api/services/topUpCable';

import {StackScreen} from '../../navigation/screenParams';
import tw from '../../lib/tailwind';
import useAppStore from '../../store';
import CableSchema from './cable.schema';
import type {CableFormFields} from './cable.d';
import requestInAppReview from '../../utils/requestInAppReview';

// FIXME: resolve variation code amount error

// Cable Screen Component
const Cable = ({}: StackScreen<'Cable'>) => {
  const [cablePlansSheetVisible, setCablePlansSheetVisible] = useState(false);
  const [requestError, setRequestError] = useState<string | undefined>(
    undefined,
  );
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>();
  const profile = useAppStore(state => state?.profile);

  const cachedFormValues = useRef<CableFormFields>();

  const [dstvPlans, gotvPlans, startimesPlans] = useQueries([
    {
      queryFn: () => getServicePlans('dstv'),
      queryKey: 'dstv-plans',
      refetchInterval: false,
    },
    {
      queryFn: () => getServicePlans('gotv'),
      queryKey: 'gotv-plans',
      refetchInterval: false,
    },
    {
      queryFn: () => getServicePlans('startimes'),
      queryKey: 'startimes-plans',
      refetchInterval: false,
    },
  ]);

  /**
   * Form and validation logics and handles
   */
  const form = useForm<CableFormFields>({
    resolver: yupResolver(CableSchema),
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    reValidateMode: 'onSubmit',
    defaultValues: {
      phoneNumber: profile?.phone,
    },
  });
  const [selectedCablePlanName, setSelectedCablePlanName] = useState(
    `Choose ${form.getValues('serviceID') || CableNetwork.Dstv} plan`,
  );

  /**
   * Similar to the function with same name in data screen
   */
  const getCurrentCableNetworkQuery = () => {
    const cableNetwork = form.getValues().serviceID;
    return cableNetwork === CableNetwork.Dstv
      ? dstvPlans
      : cableNetwork === CableNetwork.Gotv
      ? gotvPlans
      : startimesPlans;
  };

  /**
   * Shareable wrapper for cable sub API service.
   * This wrapper contains common side effects for wallet and flutterwave
   * payment while allowing for extension via promise.
   */
  const topUpCable = React.useCallback(
    async (values: Parameters<typeof _topUpCable>['0'], errorMsg?: string) => {
      // payment successful, let's hit server
      setLoaderVisible(true);
      try {
        const res = await _topUpCable(values);
        // top-up complete
        setSuccessMsg('Cable subscription successful'); // show success overlay
        return res;
      } catch (error: any) {
        // Edge case. Error when hitting server to release service paid for.
        setRequestError(errorMsg || error.message);
      } finally {
        setPaymentSheetVisible(false);
        cachedFormValues.current = undefined;
        setLoaderVisible(false);
      }
    },
    [],
  );

  /**
   * Called when user submits form
   */
  const handleSubscribe = form.handleSubmit(values => {
    Keyboard.dismiss();
    setPaymentSheetVisible(true);
  });

  /**
   * Called when user selects a cable plan from bottom sheet
   */
  const handleSelectPlan: Parameters<
    typeof CableNetworksBottomSheet
  >['0']['onSelect'] = React.useCallback(selectedCablePlan => {
    setCablePlansSheetVisible(false);
    form.setValue('planId', selectedCablePlan.variation_code);
    form.setValue('amount', +selectedCablePlan.variation_amount);
    setSelectedCablePlanName(selectedCablePlan.name);
  }, []);

  /**
   * Handle wallet payment
   */
  const handleWalletPayment = () => {
    const values = form.getValues();
    // TODO create utility function to handle below if/else logic across screens

    // assert funds sufficiency
    if (balanceIsSufficient(values.amount)) {
      // fund is sufficient
      setPaymentSheetVisible(false); // close payment bottom sheet
      setLoaderVisible(true); // show loader overlay

      // release service to user, then decrease user's wallet balance accordingly
      topUpCable(values).then(res => reduceWalletBalanceBy(values.amount));
    } else {
      // fund insufficient
      setRequestError('Insufficient wallet funds');
      return;
    }
  };

  /**
   * Handles flutterwave redirection after payment
   */
  const handleFlutterwaveRedirect = React.useCallback(
    (data: RedirectParams) => {
      if (data.status === 'successful') {
        const values = cachedFormValues.current!;
        topUpCable(values, constants.FAULTY_TX_MSG);
      } else {
        // payment failed
        cachedFormValues.current = undefined;
        setRequestError('Flutterwave payment failed');
      }
    },
    [cachedFormValues.current],
  );

  /**
   * Handles flutterwave initialisation error
   */
  const handleFlutterwaveInitError = React.useCallback(() => {
    cachedFormValues.current = undefined;
    setRequestError('Flutterwave payment initialisation failed');
  }, []);

  return (
    <>
      <SafeAreaScrollView
        backgroundColor="white"
        keyboardShouldPersistTaps="handled">
        <AppHeader
          title="Cable Subscription"
          subTitle="Recharge your cable tv subscriptions seamlessly and easily"
        />
        <View collapsable style={tw`my-6`}>
          <Text type="paragraph" color="black" style={tw`mb-2`}>
            Cable network
          </Text>
          <CableSelector
            onSelect={selectedCableNetwork => {
              if (form.getValues('serviceID') !== selectedCableNetwork) {
                setSelectedCablePlanName(`Choose ${selectedCableNetwork} plan`);
                // reset field when cable network changes. form.resetField doesn't work
                // @ts-ignore
                form.setValue('planId', undefined);
                form.setValue('serviceID', selectedCableNetwork);
              }
            }}
          />
        </View>
        <Text type="paragraph" color="black" style={tw`mb-2`}>
          Cable plan
        </Text>
        <DropMenuFieldButton
          onPress={() => {
            Keyboard.dismiss();
            setCablePlansSheetVisible(true);
          }}
          label={selectedCablePlanName}
        />
        <View style={tw`mt-4 mb-4`}>
          <InputField
            label="Smart card / IUC number"
            placeholder="Enter cable smart card / IUC number"
            keyboardType="number-pad"
            onChangeText={text => form.setValue('iucNumber', text)}
          />
          <WalletBalance />
        </View>
        <InputField
          label="Phone number"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoCorrect
          onEndEditing={handleSubscribe}
          onChangeText={text => form.setValue('phoneNumber', text)}
          defaultValue={profile?.phone || ''}
        />
        <Button
          label="Subscribe Now"
          onPress={handleSubscribe}
          style={tw`mt-4`}
        />
      </SafeAreaScrollView>
      <CableNetworksBottomSheet
        visible={cablePlansSheetVisible}
        cableNetwork={form.getValues('serviceID')}
        onDismiss={() => {
          setCablePlansSheetVisible(false);
          const query = getCurrentCableNetworkQuery();

          // refetch when bottom sheet is opened and query has error
          if (query.isError) query.refetch();
        }}
        onSelect={handleSelectPlan}
        queryInterface={getCurrentCableNetworkQuery()}
      />
      <SnackBar
        onDismiss={() => {
          form.clearErrors();
          setRequestError(undefined);
        }}
        text={getFirstError(form.formState.errors) || requestError}
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
      <PaymentBottomSheet
        visible={paymentSheetVisible}
        onDismiss={() => setPaymentSheetVisible(false)}
        handleFlutterwaveRedirect={handleFlutterwaveRedirect}
        amount={form.getValues('amount') || NaN}
        service="cable tv"
        handleFlutterwaveInitError={handleFlutterwaveInitError}
        handleWalletPayment={handleWalletPayment}
        onFlutterwaveInit={() => (cachedFormValues.current = form.getValues())}
      />
    </>
  );
};
export default Cable;
