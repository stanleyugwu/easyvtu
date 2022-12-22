//import libraries
import React, {useMemo} from 'react';
import PayWithFlutterwave, {
  PayWithFlutterwaveProps,
} from 'flutterwave-react-native/dist/PayWithFlutterwave';
import BottomSheet, {BOTTOMSHEETHEIGHT} from './BottomSheet';
import useAppStore from '../store';
import PaymentMethodButton, {PAYMENT_METHODS} from './PaymentMethodButton';
import {FlutterwaveInitOptions} from 'flutterwave-react-native/dist/FlutterwaveInit';
import constants from '../utils/constants';
import {AppServices} from '../global';
import {decrypt, encrypt} from '../utils/crypto';

interface PaymentBottomSheetProps {
  /**
   * Determines whether bottom sheet is visible
   */
  visible?: boolean;

  /**
   * Function to be called when bottoms sheet is closed
   */
  onDismiss: () => void;

  /**
   * The amount to charge
   */
  amount: number;

  /**
   * The unencrypted transaction ref to use for flutterwave.
   * We delegate tx ref generation to housing component because
   * we want tx ref to house all top-up details to aid in faulty tx handling.
   * This component will handle encryption of tx_ref
   */
  flutterwaveTxRef: string;

  /**
   * Indicates the service being paid for
   */
  service: AppServices;

  /**
   * Handles wallet payment
   */
  handleWalletPayment?: () => void;

  /**
   * Handles Flutterwave redirect
   */
  handleFlutterwaveRedirect: PayWithFlutterwaveProps['onRedirect'];

  /**
   * Handles Flutterwave initialisation error
   */
  handleFlutterwaveInitError?: PayWithFlutterwaveProps['onInitializeError'];

  /**
   * Called when Flutterwave initialises successfully
   */
  onFlutterwaveInit?: PayWithFlutterwaveProps['onDidInitialize'];
}

// Payment Bottom Sheet Component
const PaymentBottomSheet = ({
  amount,
  handleFlutterwaveInitError,
  handleFlutterwaveRedirect,
  handleWalletPayment,
  onDismiss,
  onFlutterwaveInit,
  service = 'airtime',
  visible = false,
  flutterwaveTxRef,
}: PaymentBottomSheetProps) => {
  const balance = useAppStore(state => state.profile?.wallet_balance);
  const profile = useAppStore(state => state.profile);
  const txRef = useMemo(() => encrypt(
    flutterwaveTxRef || `service=${service};amt=${amount};dt=${Date.now()}`,
  ),[flutterwaveTxRef, amount]);

  // flutterwave options
  const flutterwaveOptions = useMemo<
    Omit<FlutterwaveInitOptions, 'redirect_url'>
  >(
    () => ({
      ...constants.INCOMPLETE_STATIC_FLUTTERWAVE_PAYMENT_OPTIONS,
      amount: amount,
      tx_ref: txRef || `service=${service};amt=${amount};dt=${Date.now()}`,
      customer:
        profile?.email && profile?.username
          ? {
              // TODO: resolve email to use for guest user
              email: profile.email,
              name: profile.username,
            }
          : constants.INCOMPLETE_STATIC_FLUTTERWAVE_PAYMENT_OPTIONS.customer,
      customizations: {
        description: `#${amount} ${service} ${
          service !== 'scratch card' ? 'top-up' : ''
        } transaction`,
        title: `EasyVtu ${service[0].toUpperCase() + service.substring(1)} ${
          service !== 'scratch card' ? 'Top-Up' : ''
        } Payment`,
      },
    }),
    [amount, profile?.email, profile?.username, txRef],
  );

  return (
    <BottomSheet
      title="Choose payment method"
      visible={visible}
      height={BOTTOMSHEETHEIGHT.HALF}
      onDismiss={onDismiss}>
      {balance !== undefined && (
        <PaymentMethodButton
          method={PAYMENT_METHODS.WALLET}
          onPress={handleWalletPayment!}
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
              props.onPress();
            }}
            label={'Pay with Flutterwave'}
          />
        )}
        onDidInitialize={onFlutterwaveInit}
        onInitializeError={handleFlutterwaveInitError}
      />
    </BottomSheet>
  );
};

export default PaymentBottomSheet;
