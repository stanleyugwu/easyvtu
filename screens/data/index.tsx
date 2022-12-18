//import libraries
import React, {useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Button from '~components/Button';
import DataSchema from './data.schema';
import CarrierAndPhoneNumberField from '~components/CarrierAndPhoneNumberField';
import SnackBar from '~components/SnackBar';
import getFirstError from '../../utils/getFirstError';
import PaymentBottomSheet from '~components/PaymentBottomSheet';
import FlutterwaveInitError from 'flutterwave-react-native/dist/utils/FlutterwaveInitError';
import {useQueries} from 'react-query';
import _axios from '../../api/axios';
import getServicePlans from '../../api/services/getServicePlans';
import BottomSheet, {BOTTOMSHEETHEIGHT} from '~components/BottomSheet';
import {Carrier} from '../airtime/airtime.d';
import FlatViewLoader from '~components/FlatViewLoader';
import FlatViewError from '~components/FlatViewError';
import {StackScreen} from '../../navigation/screenParams';
import Loader from '~components/Loader';
import dataTopUp from '../../api/services/dataTopUp';
import SuccessOverlay from '~components/SuccessOverlay';
import {RedirectParams} from 'flutterwave-react-native/dist/PayWithFlutterwave';
import {DataTopUpFormValues} from './data';
import DropMenuFieldButton from '~components/DropMenuFieldButton';
import WalletBalance from '~components/WalletBalance';
import balanceIsSufficient from '../../utils/balanceIsSufficient';
import reduceWalletBalanceBy from '../../utils/reduceWalletBalance';
import requestInAppReview from '../../utils/requestInAppReview';
import useInAppUpdate from '../../hooks/useInAppUpdate';

// MobileData Screen Component
const MobileData = (route: StackScreen<'Data'>) => {
  // in-app update
  useInAppUpdate();
  
  const [requestError, setRequestError] = useState<string | undefined>(
    undefined,
  );
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [plansSheetVisible, setPlansSheetVisible] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | undefined>();
  /**
   * We implement a security measure for top-up whereby we cache form values
   * before initialising payment with external payment gateway so when payment is
   * complete, we release the service (data top-up) using the cached values instead of
   * reading the form values after payment completion
   */
  const cachedFormValues = useRef<DataTopUpFormValues>();

  /**
   * In order to handle faulty transactions, or edge case where user completes
   * payment but hits network error when app is about to top-up his/her account,
   * this ref will cache details of an incomplete top-up so when user has stable
   * connection, the top-up will be completed.
   */
  const incompleteTopUpCache = useRef<DataTopUpFormValues | undefined>(
    undefined,
  );

  /**
   * Data plans queries
   */
  const [mtnPlans, airtelPlans, gloPlans, etisalatPlans] = useQueries([
    {
      queryFn: () => getServicePlans('mtn-data'),
      queryKey: 'mtn-data-plans',
      refetchInterval: false,
    },
    {
      queryFn: () => getServicePlans('airtel-data'),
      queryKey: 'airtel-data-plans',
      refetchInterval: false,
    },
    {
      queryFn: () => getServicePlans('glo-data'),
      queryKey: 'glo-data-plans',
      refetchInterval: false,
    },
    {
      queryFn: () => getServicePlans('etisalat-data'),
      queryKey: 'etisalat-data-plans',
      refetchInterval: false,
    },
  ]);

  // stores user-friendly name of the selected data plan
  const [selectedPlanName, setSelectedPlanName] =
    useState('Select a data plan');

  /**
   * Form and validation logics and handles
   */
  const {
    formState: {errors},
    control,
    setValue,
    clearErrors,
    getValues,
    reset,
    handleSubmit,
  } = useForm<DataTopUpFormValues>({
    resolver: yupResolver(DataSchema),
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    reValidateMode: 'onSubmit',
  });

  /**
   * stateful form values
   */
  const formValues = useWatch({control, defaultValue: {carrier: Carrier.Mtn}});

  const handleSelectDataPlan = () => {
    setPlansSheetVisible(true);
    const currentQuery = getCurrentCarrierQuery();
    if (currentQuery.isError) currentQuery.refetch();
  };

  const handleBuyData = handleSubmit(d => {
    // here we check if there's an incomplete top-up so that we
    // complete it before initialising new transaction
    if (incompleteTopUpCache.current) {
      const values = incompleteTopUpCache.current;
      setLoaderVisible(true);
      return dataTopUp(
        values.carrier as Carrier,
        values.planId,
        values.amount,
        values.phoneNumber,
      )
        .then(res => {
          // top-up completed. let's clear incomplete top up cache.
          // DON'T REMOVE BELOW LINE
          incompleteTopUpCache.current = undefined;
          setSuccessMsg(
            `Previous incomplete top-up of #${
              values.amount + ' ' + values.carrier + ' data'
            } to ${values.phoneNumber} completed successfully`,
          );
        })
        .catch(error => {
          // we'll show error but won't clear incomplete top-up cache
          setRequestError(
            'Error completing previous top-up transaction. Check your internet connection and try again',
          );
        })
        .finally(() => setLoaderVisible(false));
    } else setPaymentSheetVisible(true);
  });

  // Handles redirection after flutterwave payment
  const handleFlutterwaveRedirect = React.useCallback(
    async (data: RedirectParams) => {
      if (data.status === 'successful') {
        const values = cachedFormValues.current!;

        // payment successful, let's hit server
        setLoaderVisible(true);
        dataTopUp(
          values.carrier as Carrier,
          values.planId,
          values.amount,
          values.phoneNumber,
        )
          .then(res => {
            // top-up complete
            setSuccessMsg('Data top-up transaction successful'); // show success overlay
          })
          .catch(error => {
            // Edge case. Error when hitting server. we need make sure top-up is
            // completed cus user has completed payment. lets cache the top-up details
            // for later and show error.
            setRequestError(
              `Payment was successful but top-up failed. Connect to internet now and press 'Buy Airtime' button to complete your transaction. Don't close the app, and stay on this screen until top-up completes`,
            );
            incompleteTopUpCache.current = {...values};
          })
          .finally(() => {
            setPaymentSheetVisible(false);
            cachedFormValues.current = undefined;
            setLoaderVisible(false);
          });
      } else {
        // payment failed
        cachedFormValues.current = undefined;
        setRequestError('Flutterwave payment failed');
      }
    },
    [cachedFormValues.current],
  );

  const handleFlutterwaveInitError = (error: FlutterwaveInitError) => {
    cachedFormValues.current = undefined;
    setRequestError('Flutterwave payment initialisation failed');
  };

  // Handles wallet payment
  const handleWalletPayment = async () => {
    const values = getValues();
    /**
     * assert funds sufficiency
     */
    if (balanceIsSufficient(values.amount)) {
      // fund is sufficient
      setPaymentSheetVisible(false); // close payment bottom sheet
      setLoaderVisible(true); // show loader overlay

      dataTopUp(
        values.carrier as Carrier,
        values.planId,
        values.amount,
        values.phoneNumber,
      )
        .then(res => {
          setSuccessMsg('Data top-up transaction successful'); // show success overlay
          reduceWalletBalanceBy(values.amount); // update wallet balance
        })
        .catch(error => {
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
   * This will be used to get the reference to the query object of the
   * currently selected carrier network.
   * Note that we're determining the current query object on call.
   *
   * We would've used a state to store the reference and change it when carrier changes,
   * but doing that we won't be able to pick changes to the real query object e.g mtnPlans
   * from the reference state as the reference state can't keep in sync with the real query
   * e.g mtnPlans to notice changes.
   *
   * Also notice we're not using any memoisation wrappers like useCallback because that
   * would give us the same issue as stateful reference above.
   */
  const getCurrentCarrierQuery = () => {
    const carrier = formValues.carrier;
    return carrier === Carrier.Airtel
      ? airtelPlans
      : carrier === Carrier.Glo
      ? gloPlans
      : carrier === Carrier.Etisalat
      ? etisalatPlans
      : mtnPlans;
  };

  return (
    <>
      <SafeAreaScrollView backgroundColor="white">
        <AppHeader
          title="Buy Data"
          subTitle="Purchase your favorite data bundles easily and seamlessly"
        />
        <View style={tw`my-4`}>
          <CarrierAndPhoneNumberField
            onPhoneChange={numberAndCarrier => {
              setValue('phoneNumber', numberAndCarrier[0]);
              if (numberAndCarrier[1]) {
                setValue('carrier', numberAndCarrier[1]);
                if(formValues.carrier !== numberAndCarrier[1]){
                  setSelectedPlanName('Select a data plan');
                  // @ts-ignore
                  setValue("planId", undefined);
                }
              }
            }}
          />
          <View style={tw`my-2`}>
            <Text type="paragraph" color="black" style={tw`mb-2`}>
              Data Plan
            </Text>
            <DropMenuFieldButton
              onPress={handleSelectDataPlan}
              label={selectedPlanName}
            />
          </View>
          <WalletBalance />
          <Button label="Buy Data" style={tw`my-6`} onPress={handleBuyData} />
        </View>
      </SafeAreaScrollView>
      <SnackBar
        text={getFirstError(errors) || requestError}
        onDismiss={() => (clearErrors(), setRequestError(undefined))}
        timeOut={requestError ? 10000 : undefined}
      />
      <PaymentBottomSheet
        visible={paymentSheetVisible}
        onDismiss={() => setPaymentSheetVisible(false)}
        handleFlutterwaveRedirect={handleFlutterwaveRedirect}
        amount={formValues.amount || NaN}
        service="data"
        handleFlutterwaveInitError={handleFlutterwaveInitError}
        handleWalletPayment={handleWalletPayment}
        onFlutterwaveInit={() => (cachedFormValues.current = getValues())}
      />
      <BottomSheet
        title={`Choose ${formValues.carrier} plan`}
        visible={plansSheetVisible}
        onDismiss={() => setPlansSheetVisible(false)}
        height={BOTTOMSHEETHEIGHT.THREE_QUATER}>
        <FlatViewLoader
          style={tw`mt-8`}
          visible={getCurrentCarrierQuery().isLoading}
          text={`Loading ${formValues.carrier} data plans`}
        />
        <FlatViewError
          style={tw`mt-8`}
          visible={getCurrentCarrierQuery().isLoadingError}
          text={
            'Error loading data plans. Check your internet connection and try again'
          }
          onRetry={() => getCurrentCarrierQuery().refetch()}
        />
        {(() => {
          /**
           * We used IIFE instead of conditional rendering to avoid
           * long variable references. IIFE will just cost one stack
           */
          let plans = getCurrentCarrierQuery().data?.data.variations;

          if (!plans) return null;

          return plans.length ? (
            plans?.map((plan, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                style={tw`py-2`}
                onPress={() => {
                  setSelectedPlanName(plan?.name);
                  setPlansSheetVisible(false);
                  setValue('planId', plan?.variation_code);
                  setValue('amount', +plan?.variation_amount);
                }}>
                <Text>{plan.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No data plan for now, check back later</Text>
          );
        })()}
      </BottomSheet>
      <Loader visible={loaderVisible} />
      <SuccessOverlay
        visible={!!successMsg}
        successText={successMsg}
        onDismiss={() => {
          setSuccessMsg(undefined);
          reset();
          requestInAppReview();
        }}
      />
    </>
  );
};

export default MobileData;
