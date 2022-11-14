//import libraries
import React, {useEffect, useId, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '../../components/SafeAreaScrollView';
import AppHeader from '../../components/AppHeader';
import InputField from '../../components/InputField';
import CarrierSelector from '../../components/CarrierSelector';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AirtimeSchema from './airtime.schema';
import {InferType} from 'yup';
import {Carrier, IncompleteTopUp} from './airtime.d';
import Button from '../../components/Button';
import SnackBar from '../../components/SnackBar';
import getFirstError from '../../utils/getFirstError';
import detectCarrierFromPhoneNumber from '../../utils/detectCarrierFromPhoneNumber';
import detectUserPhoneNumbers from '../../utils/detectUserPhoneNumbers';
import Text from '../../components/Text';
import useAppStore from '../../store';
import formatAmount from '../../utils/formatAmount';
import BottomSheet, {BOTTOMSHEETHEIGHT} from '../../components/BottomSheet';
import PaymentMethodButton, {
  PAYMENT_METHODS,
} from '../../components/PaymentMethodButton';
import Loader from '../../components/Loader';
import airtimeTopUp from '../../api/services/topUpAirtime';
import SuccessOverlay from '../../components/SuccessOverlay';
import PayWithFlutterwave from 'flutterwave-react-native';
import {RedirectParams} from 'flutterwave-react-native/dist/PayWithFlutterwave';
import {FlutterwaveInitOptions} from 'flutterwave-react-native/dist/FlutterwaveInit';
import FlutterwaveInitError from 'flutterwave-react-native/dist/utils/FlutterwaveInitError';
import constants from '../../utils/constants';
import ContactSelector from '../../components/ContactSelector';

// Airtime Screen Component
const Airtime = () => {
  const balance = useAppStore(state => state.profile?.wallet_balance);
  const profile = useAppStore(state => state.profile);
  const updateProfile = useAppStore(state => state.setProfile);

  /**
   * Form and validation logics and handles
   */
  const {
    formState: {errors},
    control,
    setValue,
    clearErrors,
    reset,
    handleSubmit,
    getValues,
  } = useForm<InferType<typeof AirtimeSchema>>({
    resolver: yupResolver(AirtimeSchema),
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    reValidateMode: 'onSubmit',
  });

  // will help us trigger re-render on input change and give
  // us up-to-date form values
  const formValues = useWatch({
    control,
    name: ['amount', 'phoneNumber', 'carrier'],
  });

  // handles submission after form-level validation
  const handleBuyAirtime = handleSubmit(data => {
    // TODO: create a proper method of checking user login state instead of
    // by checking the value of profile balance

    // here we check if there's an incomplete top-up so that we
    // complete it before initialising new transaction
    if (incompleteTopUpCache.current) {
      const values = incompleteTopUpCache.current;
      setLoaderVisible(true);
      return airtimeTopUp(values.phone, values.amount, values.carrier)
        .then(res => {
          // top-up completed. let's clear incomplete top up cache.
          // DON'T REMOVE BELOW LINE
          incompleteTopUpCache.current = undefined;
          setSuccessMsg(
            `Previous incomplete top-up of #${
              values.amount + ' ' + values.carrier
            } to ${values.phone} completed successfully`,
          );
        })
        .catch(error => {
          // we'll show error but won't clear incomplete top-up cache
          setRequestError(
            'Error completing previous top-up transaction. Check your internet connection and try again',
          );
        })
        .finally(() => setLoaderVisible(false));
    }

    // show payment methods bottom sheet
    setPaymentSheetVisible(true);
  });

  // state for server-level errors
  const [requestError, setRequestError] = useState<string | undefined>(
    undefined,
  );

  // bottom sheet for payment method selection
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();

  /**
   * In order to handle faulty transactions, or edge case where user completes
   * payment but hits network error when app is about to top-up his/her account,
   * this ref will cache details of an incomplete top-up so when user has ctable
   * connection, the top-up will be completed.
   */
  const incompleteTopUpCache = useRef<IncompleteTopUp | undefined>(undefined);

  /**
   * This ref will be used to cache form values when flutterwave payment is initialised.
   * the form values will be used after successful payment, but we don't want to get the values
   * after payment as user might change them causing inconsistency btw amount paid and amount entered
   */
  const cachedFormValues = useRef<InferType<typeof AirtimeSchema> | undefined>(
    undefined,
  );

  // facilitates detecting user's phone number
  const detectNumber = React.useCallback(async () => {
    try {
      const selectedNumber = await detectUserPhoneNumbers();
      if (selectedNumber && selectedNumber.length > 0)
        setValue('phoneNumber', selectedNumber);
    } catch (error) {
      // nothing should be thrown here, but just incase something
      // is thrown, let's swallow it
    }
  }, [setValue]);

  // Handles wallet payment
  const handleWalletPaymentMethod = async () => {
    const values = getValues();
    /**
     * assert funds sufficiency
     */
    if (balance && typeof +balance === 'number' && +balance >= values.amount) {
      // fund is sufficient
      setPaymentSheetVisible(false); // close payment bottom sheet
      setLoaderVisible(true); // show loader overlay

      airtimeTopUp(values.phoneNumber, values.amount, values.carrier as Carrier)
        .then(res => {
          setSuccessMsg(res.message); // show success overlay
          updateProfile({wallet_balance: `${+balance - values.amount}`}); // update wallet balance
        })
        .catch(error => {
          // FIXME: resolve invalid request ID error with backend
          setRequestError(error.message);
        })
        .finally(() => {
          setLoaderVisible(false);
        });
    } else {
      // fund insufficient
      setRequestError('Insufficient wallet funds');
      return;
    }
  };

  /**
   * resets form after successful payment
   */
  const handleAfterSuccessfulPayment = React.useCallback(() => {
    setSuccessMsg(undefined);
    reset(); // reset form
  }, []);

  /**
   * FLUTTERWAVE STUFFS
   */
  // tx_ref id gen
  const id = useId();

  // flutterwave options
  const flutterwaveOptions = useMemo<
    Omit<FlutterwaveInitOptions, 'redirect_url'>
  >(
    () => ({
      ...constants.INCOMPLETE_STATIC_FLUTTERWAVE_PAYMENT_OPTIONS,
      amount: formValues[0],
      tx_ref: `${formValues[0]}-airtime-top-up-${Date.now() + id}`,
      customer:
        profile?.email && profile?.username
          ? {
              // TODO: resolve email to use for guest user
              email: profile.email,
              name: profile.username,
            }
          : constants.INCOMPLETE_STATIC_FLUTTERWAVE_PAYMENT_OPTIONS.customer,
      customizations: {
        description: `#${formValues[0]} airtime top-up transaction`,
        title: 'EasyVtu Airtime Top-up Payment',
      },
    }),
    [
      formValues[0],
      requestError,
      successMsg,
      profile?.email,
      profile?.username,
    ],
  );

  // Handles redirection after flutterwave payment
  const handleFlutterwaveRedirect = React.useCallback(
    async (data: RedirectParams) => {
      if (data.status === 'successful') {
        const values = cachedFormValues.current!;

        // payment successful, let's hit server
        setLoaderVisible(true);
        airtimeTopUp(
          values.phoneNumber,
          values.amount,
          values.carrier as Carrier,
        )
          .then(res => {
            // top-up complete
            setSuccessMsg(res.message); // show success overlay
          })
          .catch(error => {
            // TODO: find a better way to prevent faulty transaction or incomplete top-up

            // Edge case. Error when hitting server. we need make sure top-up is
            // completed cus user has completed payment. lets cache the top-up details
            // for later and show error.
            setRequestError(
              `Payment was successful but top-up failed. Connect to internet now and press 'Buy Airtime' button to complete your transaction. Don't close the app, and stay on this screen until top-up completes`,
            );
            incompleteTopUpCache.current = {
              amount: values.amount,
              phone: values.phoneNumber,
              carrier: values.carrier as Carrier,
            };
          })
          .finally(() => {
            setPaymentSheetVisible(false);
            cachedFormValues.current = undefined;
            setLoaderVisible(false);
          });
      } else {
        // payment failed
        cachedFormValues.current = undefined;
        setRequestError('Flutterwave payment cancelled');
      }
    },
    [cachedFormValues.current],
  );

  const handleFlutterwaveInitError = (error: FlutterwaveInitError) => {
    cachedFormValues.current = undefined;
    setRequestError('Error initialising payment. Try again');
  };

  /**
   * This effect handles detecting mobile number from user's phone
   * for self top-up on mount.
   */
  useEffect(() => {
    detectNumber();
  }, []);

  /**
   * monitors update to phone number field and
   * performs auto-carrier detection
   */
  useEffect(() => {
    const detectedCarrier = detectCarrierFromPhoneNumber(
      getValues('phoneNumber'),
    );
    if (detectedCarrier) setValue('carrier', detectedCarrier);
  }, [getValues('phoneNumber')]);

  return (
    <>
      <SafeAreaScrollView backgroundColor="white">
        <AppHeader
          title="Buy Airtime"
          subTitle="Purchase airtime for yourself and your loved ones in a twinkle"
        />
        <View style={tw`my-2`}>
          <InputField
            label="Phone Number"
            placeholder="Receipient phone number"
            rightElement={
              <ContactSelector
                onSelect={selectedNumber =>
                  setValue('phoneNumber', selectedNumber)
                }
              />
            }
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            value={formValues[1]}
            onChangeText={value => setValue('phoneNumber', value)}
          />
          <View style={tw`my-3`}>
            <CarrierSelector selected={formValues[2] as Carrier} />
          </View>
          <InputField
            label="Amount"
            placeholder="Artime amount"
            value={formValues[0] ? `${formValues[0]}` : undefined}
            keyboardType="number-pad"
            onChangeText={value => setValue('amount', +value)}
          />
          {balance && (
            <Text
              type="caption"
              style={tw`border-dashed self-start px-2 border-[1.2px] border-primary`}
              children={`Bal: \u20A6${formatAmount(balance)}`}
            />
          )}
          <Button
            label="Buy Airtime"
            onPress={handleBuyAirtime}
            style={tw`my-6`}
          />
        </View>
      </SafeAreaScrollView>
      <SnackBar
        text={getFirstError(errors) || requestError}
        onDismiss={() => (clearErrors(), setRequestError(undefined))}
        timeOut={
          requestError
            ? requestError
                // here we want to show incomplete top-up error for longer time
                ?.startsWith?.('Payment was successful')
              ? 15000
              : 5000
            : undefined
        }
      />
      <BottomSheet
        title="Choose payment method"
        visible={paymentSheetVisible}
        height={BOTTOMSHEETHEIGHT.HALF}
        onDismiss={() => setPaymentSheetVisible(false)}>
        {balance !== undefined && (
          <PaymentMethodButton
            method={PAYMENT_METHODS.WALLET}
            onPress={handleWalletPaymentMethod}
          />
        )}
        <PayWithFlutterwave
          onRedirect={handleFlutterwaveRedirect}
          options={flutterwaveOptions}
          currency={'NGN'}
          customButton={props => (
            <PaymentMethodButton
              method={PAYMENT_METHODS.FLUTTERWAVE}
              onPress={() => {
                // early termination
                if (props.disabled) return;

                // lets cache form values to be used for top-up completion after payment
                cachedFormValues.current = getValues();
                props.onPress();
              }}
              label={'Pay with Flutterwave'}
            />
          )}
          onInitializeError={handleFlutterwaveInitError}
        />
      </BottomSheet>
      <Loader visible={loaderVisible} />
      <SuccessOverlay
        visible={!!successMsg}
        onDismiss={handleAfterSuccessfulPayment}
        successText={successMsg}
      />
    </>
  );
};

export default Airtime;
