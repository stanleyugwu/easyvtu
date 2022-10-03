//import libraries
import React from 'react';
import Text from '../../components/Text';
import tw from '../../lib/tailwind';
import {StackScreen} from '../../navigation/screenParams';
import Button from '../../components/Button';
import SafeAreaScrollView from '../../components/SafeAreaScrollView';
import * as Animatable from 'react-native-animatable';

// Landing screen from where user chooses to sign up or login or use app as guest
const Landing = ({navigation}: StackScreen<'Landing'>) => {
  return (
    <SafeAreaScrollView
      backgroundColor="primary"
      contentContainerStyle={tw`h-full justify-center`}>
      <Animatable.View animation={'fadeInUp'} iterationCount={1}>
        <Text type="subTitle" style={tw`text-gray5`}>
          Welcome to Easy-Vtu
        </Text>
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} iterationCount={1} delay={200}>
        <Text type="caption" style={tw`text-gray5`}>
          Login or create an account to get started. You can also enjoy easy
          top-ups without creating an account.{' '}
        </Text>
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} iterationCount={1} delay={400}>
        <Button
          label="Login"
          gradientType="secondary"
          style={tw`mt-10`}
          onPress={() => navigation.navigate('SignIn')}
        />
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} iterationCount={1} delay={600}>
        <Button
          label="Create account"
          gradientType="secondary"
          style={tw`my-6`}
          onPress={() => navigation.navigate('SignUp')}
        />
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} iterationCount={1} delay={800}>
        <Button
          label="Continue without login"
          gradient={[tw.color('white')!, tw.color('white')!]}
          labelColor="black"
          onPress={() => navigation.navigate('GuestHome')}
        />
      </Animatable.View>
    </SafeAreaScrollView>
  );
};

export default Landing;
