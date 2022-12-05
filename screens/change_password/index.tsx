//import libraries
import React, {useCallback, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {useForm} from 'react-hook-form';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import InputField from '~components/InputField';
import OpenEyeIcon from '~images/open_eye.svg';
import ClosedEyeIcon from '~images/closed_eye.svg';
import Button from '~components/Button';
import {yupResolver} from '@hookform/resolvers/yup';
import ChangePasswordSchema from './changePassword.schema';
import {InferType} from 'yup';
import SnackBar from '~components/SnackBar';
import getFirstError from '../../utils/getFirstError';
import changePassword from '../../api/services/changePassword';
import Loader from '~components/Loader';
import SuccessOverlay from '~components/SuccessOverlay';

/**
 * Returns closed or opened eye icon based on passed state
 */
const GetEyeIcon = (masked: boolean, setMask: Function) => {
  return masked ? (
    <OpenEyeIcon width="50px" onPress={() => setMask(false)} />
  ) : (
    <ClosedEyeIcon width="50px" onPress={() => setMask(true)} />
  );
};

// ChangePassword Screen Component
const ChangePassword = () => {
  const [passwordMasked, setPasswordMasked] = React.useState(true);
  const [confirmPasswordMasked, setConfirmPasswordMasked] =
    React.useState(true);
  const [requestError, setRequestError] = useState<string | undefined>(
    undefined,
  );
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [successMsgVisible, setSuccessMsgVisible] = useState(false);

  const form = useForm<InferType<typeof ChangePasswordSchema>>({
    resolver: yupResolver(ChangePasswordSchema),
  });

  /**
   * Handles changing password after validation
   */
  const handleChangePassword = useCallback(
    form.handleSubmit(data => {
      setLoaderVisible(true);
      Keyboard.dismiss();
      changePassword(data.password)
        .then(res => {
          setSuccessMsgVisible(true);
        })
        .catch(error => {
          setRequestError(error.message);
        })
        .finally(() => setLoaderVisible(false));
    }),
    [],
  );

  return (
    <>
      <SafeAreaScrollView
        backgroundColor="white"
        keyboardShouldPersistTaps="handled">
        <AppHeader title="Change Password" />

        <View style={tw`mt-6 mb-4`}>
          <InputField
            label="New password"
            placeholder="Enter new password"
            onChangeText={text => form.setValue('password', text)}
            secureTextEntry={passwordMasked}
            rightElement={GetEyeIcon(passwordMasked, setPasswordMasked)}
          />
          <InputField
            label="Confirm new password"
            placeholder="Re-enter password"
            onSubmitEditing={handleChangePassword}
            onChangeText={text => form.setValue('confirmPassword', text)}
            secureTextEntry={confirmPasswordMasked}
            rightElement={GetEyeIcon(
              confirmPasswordMasked,
              setConfirmPasswordMasked,
            )}
          />
        </View>
        <Button label="Change Password" onPress={handleChangePassword} />
      </SafeAreaScrollView>
      <Loader visible={loaderVisible} />
      <SnackBar
        text={getFirstError(form.formState.errors) || requestError}
        onDismiss={() => {
          setRequestError(undefined);
          form.clearErrors();
        }}
      />
      <SuccessOverlay
        onDismiss={form.reset}
        visible={successMsgVisible}
        successText="Password Changed Successfully"
      />
    </>
  );
};

export default ChangePassword;
