//import libraries
import React, {useRef, useState, useMemo} from 'react';
import {Keyboard, View} from 'react-native';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import InputField from '~components/InputField';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import AirtimeSchema from './airtime.schema';
import {InferType} from 'yup';
import {Carrier} from './airtime.d';
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
import FaultyTxModal from '~components/FaultyTxModal';

// Airtime Screen Component
const Airtime = () => {
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
    Keyboard.dismiss();
    // TODO: create a proper method of checking user login state instead of
    // by checking the value of profile balance

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
  const [faultyTxRef, setFaultyTxRef] = useState<string | undefined>(undefined);
  /**
   * This ref will be used to cache form values when flutterwave payment is initialised.
   * the form values will be used after successful payment, but we don't want to get the values
   * after payment as user might change them causing inconsistency btw amount paid and amount entered
   */
  const cachedFormValues = useRef<InferType<typeof AirtimeSchema> | undefined>(
    undefined,
  );

  // Airtime Tx ref
  const TX_REF = useMemo(
    () =>
      `service=airtime;amt=${getValues('amount')};carrier=${getValues(
        'carrier',
      )};phone=${getValues('phoneNumber')};dt=${Date.now()}`,
    [
      /* when the value of any form field changes we regenrate tx_ref*/
      Object.values(getValues()).join(''),
    ],
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
            /**
             * The most secured approach to faulty tx:
             * when tx is faulty, try and encrypt and store tx_ref & top-up details in storage.
             * if storage failed, show the user the tx_ref so to resolve the issue with customer care.
             * customer care would verify tx_ref, release top-up to user, then store tx_ref in resolved tx db
             * if storage succeeds, an error is shown to user and a 'retry-previous-tx' button appears on the
             * service screen e.g airtime screen. The visibilty of the btn depends on the existence of the faulty tx
             * storage in device. When btn is pressed, app retrieves and decrypts stored faulty tx details, verifies tx_ref,
             * retrieves top-up amount from verified tx, releases top-up value, stores the tx_ref in resolved tx db, and
             * deletes the faulty tx from storage.
             *
             * Another approach would be to embed every top-up detail e.g amount, service, even tx_id into the tx_ref and encode/encrypt it.
             * The user can present the encrypted/encoded text to customer care and customer care will know the details of the
             * tx and be able to confirm it. Or the app can take the encrypted/emcoded tx_ref, decode it and know what value to release
             * to user
             *
             * However, the feasible approach now is to resolve issue using tx_ref through customer care
             */

            // show faulty tx view
            setFaultyTxRef(data.tx_ref);
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
            onSubmitEditing={handleBuyAirtime}
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
        flutterwaveTxRef={TX_REF}
        handleWalletPayment={handleWalletPaymentMethod}
      />
      <Loader visible={loaderVisible} />
      <SuccessOverlay
        visible={!!successMsg}
        onDismiss={handleAfterSuccessfulPayment}
        successText={successMsg}
      />
      <FaultyTxModal
        txRef={faultyTxRef}
        onDismiss={() => setFaultyTxRef(undefined)}
      />
    </>
  );
};

export default Airtime;
