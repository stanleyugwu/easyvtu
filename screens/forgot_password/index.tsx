//import libraries
import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import {StackScreen} from '../../navigation/screenParams';
import AppHeader from '~components/AppHeader';
import InputField from '~components/InputField';
import Button from '~components/Button';
import _axios from '../../api/axios';
import SnackBar from '~components/SnackBar';
import SuccessOverlay from '~components/SuccessOverlay';
import useAppStore from '../../store';
import Loader from '~components/Loader';

// ForgotPassword Screen Component
const ForgotPassword = ({
  navigation: {goBack},
}: StackScreen<'ForgotPassword'>) => {
  const [email, setEmail] = useState('');
  const [requestError, setReqestError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecoverPassword = () => {
    setLoading(true);
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      )
    ) {
      setLoading(false);
      return setReqestError('Supply valid e-mail address');
    }
    _axios
      .post<number>('/forgot_password', {email})
      .then(res => {
        setLoading(false);
        setSuccessMsg(
          `${res.message}\nFollow the instructions sent to you e-mail to continue`,
        );
      })
      .catch(err => {
        setReqestError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <SuccessOverlay
        timeout={5000}
        visible={!!successMsg}
        successText={successMsg}
        onDismiss={goBack}
      />
      <Loader visible={loading} />
      <SnackBar text={requestError} onDismiss={() => setReqestError('')} />
      <SafeAreaScrollView backgroundColor="white">
        <AppHeader
          title="Forgot Password"
          subTitle="Don't worry, we all forget. Just enter your e-mail address below so we'll help you get back to your account"
        />
        <View style={tw`mt-10`} />
        <InputField
          label="E-mail address"
          placeholder="Enter your e-mail address"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Button
          disabled={!email}
          label="Recover account"
          onPress={handleRecoverPassword}
          style={tw`mt-4`}
        />
      </SafeAreaScrollView>
    </>
  );
};

export default ForgotPassword;
