//import libraries
import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import InputField from '~components/InputField';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AirtimeSchema from './airtime.schema';
import {InferType} from 'yup';
import {Carrier, IncompleteTopUp} from './airtime.d';
import Button from '~components/Button';
import SnackBar from '~components/SnackBar';
import getFirstError from '../../utils/getFirstError';
import Loader from '~components/Loader';
import airtimeTopUp from '../../api/services/topUpAirtime';
import SuccessOverlay from '~components/SuccessOverlay';
import {RedirectParams} from 'flutterwave-react-native/dist/PayWithFlutterwave';
import FlutterwaveInitError from 'flutterwave-react-native/dist/utils/FlutterwaveInitError';
import CarrierAndPhoneNumberField from '~components/CarrierAndPhoneNumberField';
import PaymentBottomSheet from '~components/PaymentBottomSheet';
import WalletBalance from '~components/WalletBalance';
import reduceWalletBalanceBy from '../../utils/reduceWalletBalance';
import balanceIsSufficient from '../../utils/balanceIsSufficient';
import requestInAppReview from '../../utils/requestInAppReview';
import useInAppUpdate from '../../hooks/useInAppUpdate';

// Airtime Screen Component
const Airtime = () => {
   // in-app update
   useInAppUpdate();

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
   * this ref will cache details of an incomplete top-up so when user has stable
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

  // Handles wallet payment
  const handleWalletPaymentMethod = async () => {
    const values = getValues();
    /**
     * assert funds sufficiency
     */
    if (balanceIsSufficient(values.amount)) {
      // fund is sufficient
      setPaymentSheetVisible(false); // close payment bottom sheet
      setLoaderVisible(true); // show loader overlay

      airtimeTopUp(values.phoneNumber, values.amount, values.carrier as Carrier)
        .then(res => {
          setSuccessMsg(res.message); // show success overlay
          reduceWalletBalanceBy(values.amount); // update wallet balance
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
    requestInAppReview();
  }, []);

  /**
   * FLUTTERWAVE STUFFS
   */

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

  return (
    <>
      <SafeAreaScrollView backgroundColor="white">
        <AppHeader
          title="Buy Airtime"
          subTitle="Purchase airtime for yourself and your loved ones in a twinkle"
        />
        <View style={tw`my-4`}>
          <CarrierAndPhoneNumberField
            onPhoneChange={numberAndCarrier => {
              setValue('phoneNumber', numberAndCarrier[0]);
              numberAndCarrier[1] && setValue('carrier', numberAndCarrier[1]);
            }}
          />
          <InputField
            label="Amount"
            placeholder="Artime amount"
            value={formValues[0] ? `${formValues[0]}` : undefined}
            keyboardType="number-pad"
            onChangeText={value => setValue('amount', +value)}
          />
          <WalletBalance />
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
      <PaymentBottomSheet
        visible={paymentSheetVisible}
        onDismiss={() => setPaymentSheetVisible(false)}
        amount={formValues[0]}
        handleFlutterwaveRedirect={handleFlutterwaveRedirect}
        service="airtime"
        handleFlutterwaveInitError={handleFlutterwaveInitError}
        onFlutterwaveInit={() => {
          // lets cache form values to be used for top-up completion after payment
          cachedFormValues.current = getValues();
        }}
        handleWalletPayment={handleWalletPaymentMethod}
      />
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
