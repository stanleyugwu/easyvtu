//import libraries
import React, {useState} from 'react';
import {Image, ScrollView, View, Keyboard} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import InputField from '~components/InputField';
import Button from '~components/Button';
import {StackScreen} from '../../navigation/screenParams';
import {SafeAreaView} from 'react-native-safe-area-context';
import Loader from '~components/Loader';
import SnackBar from '~components/SnackBar';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import signinSchema from './signIn.schema';
import getFirstError from '../../utils/getFirstError';

import tileImg from '../../assets/images/tile.png';
import wavingBird from './images/waving_bird.png';
import OpenEyeIcon from '../../assets/images/open_eye.svg';
import ClosedEyeIcon from '../../assets/images/closed_eye.svg';
import {signIn} from '../../api/services/auth';
import storeAccessToken from '../../api/util/storeAccessToken';
import useAuth from '../../hooks/useAuth';
import useAppStore from '../../store';
import AppHeader from '~components/AppHeader';

export interface SignInInputs {
  email: string;
  password: string;
}

// SignIn Screen Component
const SignIn = ({navigation: {navigate}}: StackScreen<'SignIn'>) => {
  const [passwordMasked, setPasswordMasked] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: {errors},
  } = useForm<SignInInputs>({
    resolver: yupResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [requestError, setRequestError] = useState('');

  const auth = useAuth();
  const setProfile = useAppStore.getState().setProfile;

  /**
   * Handles forgot password
   */
  const handleForgotPassword = React.useCallback(() => {
    navigate('ForgotPassword');
  }, []);

  /**
   * Handles form submission after validation
   */
  const handleLogin = handleSubmit(values => {
    Keyboard.dismiss();
    setLoaderVisible(true);
    signIn(values.email, values.password)
      .then(res => {
        const {access_token, expires_in, token_type, ...profile} = res.data;
        storeAccessToken(res.data.access_token);
        setProfile(profile);
        auth.signIn();
      })
      .catch(error => {
        setLoaderVisible(false);
        setRequestError(error.message);
      });
  });

  return (
    <SafeAreaView style={tw`bg-white flex-1 justify-end`}>
      <Loader visible={loaderVisible} />
      <SnackBar text={getFirstError(errors)} onDismiss={clearErrors} />
      <SnackBar
        text={requestError}
        onDismiss={() => setRequestError('')}
        timeOut={5000}
      />
      <Image
        source={tileImg}
        style={{position: 'absolute', top: 0, right: 0}}
        resizeMethod="resize"
        resizeMode="cover"
      />
      <View style={tw`absolute top-4 left-4`}>
        <AppHeader />
      </View>
      <View style={tw`bg-primary rounded-t-[50px] md:rounded-t-[60px]`}>
        <View style={tw`justify-center items-center mb-16 md:mb-20`}>
          <Image
            source={wavingBird}
            style={tw`md:w-32 w-28 md:h-32 h-28 absolute`}
          />
        </View>

        <ScrollView style={tw`p-4 pt-0`} keyboardShouldPersistTaps="handled">
          <Text type="subTitle" color="gray5" style={tw`text-center`}>
            Glad to have you back!
          </Text>
          <Text type="caption" color="gray4" style={tw`text-center mb-6`}>
            Fill in your login details to continue
          </Text>
          <InputField
            label="E-mail address"
            placeholder="Enter e-mail address"
            textContentType='emailAddress'
            labelColor="gray5"
            onChangeText={text => setValue('email', text)}
            {...register('email')}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            labelColor="gray5"
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
            textContentType="password"
            secureTextEntry={passwordMasked}
            onChangeText={text => setValue('password', text)}
            {...register('email')}
          />

          <Text
            color="secondary"
            style={tw`mb-6 mt-2`}
            onPress={handleForgotPassword}>
            Forgot password
          </Text>
          <Button
            label="Login"
            gradientType="secondary"
            onPress={handleLogin}
            style={tw`mb-4`}
          />
          <Text
            color="secondary"
            style={tw`text-center mb-2`}
            onPress={() => navigate('SignUp')}>
            Create an account
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
