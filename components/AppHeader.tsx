//import libraries
import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import tw from '../lib/tailwind';
import {useNavigation} from '@react-navigation/native';
import BackButton from './BackButton';

interface AppHeaderProps {
  title?: string;
  subTitle?: string;
}

// AppHeader Component
const AppHeader = ({subTitle, title}: AppHeaderProps) => {
  const {goBack, canGoBack, navigate} = useNavigation();
  return (
    <View style={tw`p-1`}>
      <BackButton
      // @ts-ignore
        onPress={() => (canGoBack() ? goBack() : navigate('Landing'))}
      />
      {title ? (
        <Text type="title" color="black" style={tw`mt-4`}>
          {title}
        </Text>
      ) : null}
      {subTitle ? (
        <Text type="caption" color="gray">
          {subTitle}
        </Text>
      ) : null}
    </View>
  );
};

export default AppHeader;
