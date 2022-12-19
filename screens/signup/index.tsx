//import libraries
import React, {useState} from 'react';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import InputField from '~components/InputField';
import {View, Keyboard} from 'react-native';
import Button from '~components/Button';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import signupSchema from './signup.schema';
import SnackBar from '~components/SnackBar';
import getFirstError from '../../utils/getFirstError';

import AppIcon from '../../assets/images/app_icon.svg';
import NigeriaFlag from '../../assets/images/nigeria_flag.svg';
import OpenEyeIcon from '../../assets/images/open_eye.svg';
import ClosedEyeIcon from '../../assets/images/closed_eye.svg';
import Loader from '~components/Loader';
import {signUp} from '../../api/services/auth';
import SuccessOverlay from '~components/SuccessOverlay';
import {StackScreen} from '../../navigation/screenParams';

export type SignUpInputs = {
  username: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// SignUp Screen Component
const SignUp = ({navigation: {navigate}}: StackScreen<'SignUp'>) => {
  const [passwordMasked, setPasswordMasked] = useState(true);
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: {errors},
  } = useForm<SignUpInputs>({
    resolver: yupResolver(signupSchema),
  });
  const [requestError, setRequestError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // handle signup action
  const handleSignup = handleSubmit(values => {
    setProcessing(true);
    Keyboard.dismiss();
    clearErrors();
    signUp(values.username, values.email, values.password, values.phoneNumber)
      .then(res => {
        setProcessing(false);
        setSuccessMsg(res.message);
      })
      .catch(error => {
        console.log(error);
        setProcessing(false);
        setRequestError(error.message);
      });
  });

  return (
    <>
      <Loader visible={processing} />
      <SnackBar text={getFirstError(errors)} onDismiss={clearErrors} />
      <SnackBar text={requestError} onDismiss={() => setRequestError('')} />
      <SuccessOverlay
        visible={!!successMsg}
        onDismiss={() => {
          setSuccessMsg('');
          navigate('SignIn');
        }}
        successText={successMsg}
        timeout={2000}
      />
      <SafeAreaScrollView
        backgroundColor="white"
        keyboardShouldPersistTaps="always">
        <AppHeader />
        {/* @ts-ignore */}
        <AppIcon style={tw`mt-4`} />
        <Text type="subTitle" color="black">
          Get started with Easy-Vtu
        </Text>
        <Text type="caption" color="gray">
          Signup to access full features, fill in your details to get started
        </Text>
        <View style={tw`mt-4`}>
          <InputField
            label="Username"
            placeholder="Choose a username"
            textContentType="username"
            keyboardType="name-phone-pad"
            onChangeText={text => setValue('username', text)}
            {...register('username')}
          />
          <InputField
            label="Phone Number"
            placeholder="Enter phone number"
            //@ts-ignore
            leftElement={<NigeriaFlag style={tw`mx-4`} />}
            textContentType="telephoneNumber"
            keyboardType="number-pad"
            onChangeText={text => setValue('phoneNumber', text)}
            {...register('phoneNumber')}
          />
          <InputField
            label="Email address"
            placeholder="Enter e-mail address"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={text => setValue('email', text)}
            {...register('email')}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            secureTextEntry={passwordMasked}
            onChangeText={text => setValue('password', text)}
            rightElement={
              passwordMasked ? (
                <OpenEyeIcon
                  // @ts-ignore
                  width="50px"
                  onPress={() => setPasswordMasked(false)}
                />
              ) : (
                <ClosedEyeIcon
                  // @ts-ignore
                  width="50px"
                  onPress={() => setPasswordMasked(true)}
                />
              )
            }
            {...register('password')}
          />
          <InputField
            label="Confirm Password"
            placeholder="Re-enter password"
            onChangeText={text => setValue('confirmPassword', text)}
            secureTextEntry={passwordMasked}
            {...register('confirmPassword')}
          />
          <Button
            label="Create account"
            style={tw`mt-6`}
            onPress={handleSignup}
          />
        </View>
      </SafeAreaScrollView>
    </>
  );
};

export default SignUp;
