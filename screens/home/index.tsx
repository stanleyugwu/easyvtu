//import libraries
import React from 'react';
import {View, Image, ScrollView, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import tw from '../../lib/tailwind';
import useAppStore from '../../store';
import UserIcon from '../../assets/images/user.svg';
import Menu from '../../assets/images/menu.svg';
import ServicesPanel from '../../components/ServicesPanel';
import {SafeAreaView} from 'react-native-safe-area-context';
import Wallet from '../../components/Wallet';
import {TabScreen} from '../../navigation/screenParams';

// Home Screen Component
const Home = ({navigation: {navigate}}: TabScreen<'Home'>) => {
  const {username, image} = useAppStore(state => state.profile!);

  const handleAddMoney = () => {
    navigate('Wallet', {
      action: 'withdraw',
    });
  };
  const handleWithdrawMoney = () => {
    navigate('Wallet', {
      action: 'deposit',
    });
  };

  return (
    <SafeAreaView style={tw`bg-primary`}>
      <View style={tw`flex-row justify-between items-center p-4 mb-20`}>
        {/* Account Profile */}
        <View style={tw`flex-row items-center`}>
          {/* Account image */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('Profile')}
            style={tw`w-16 h-16 bg-white rounded-full justify-center items-center`}>
            {image ? (
              <Image
                source={{uri: image}}
                style={tw`w-full h-full rounded-full`}
              />
            ) : (
              // @ts-ignore
              <UserIcon width="40px" height="40px" />
            )}
          </TouchableOpacity>

          {/* Account text */}
          <View style={tw`ml-2`}>
            <Text type="paragraph" color="gray5">
              Good Day
            </Text>
            <Text type="caption" color="gray4">
              {username}
            </Text>
          </View>
        </View>

        {/* Kebab Menu */}
        <Menu
          /* @ts-ignore */
          onPress={() => {
            navigate('MoreOption');
          }}
        />
      </View>

      <View style={tw`p-4 bg-gray5 rounded-t-[30px] bottom-0 h-full`}>
        <View style={tw`-mt-20`}>
          <Wallet
            onAddMoneyBtnPress={handleAddMoney}
            onWithdrawMoneyBtnPress={handleWithdrawMoney}
          />
        </View>
        <ScrollView style={tw`h-full`} contentContainerStyle={tw`h-full`}>
          <Text type="subTitle" color="black" style={tw`mt-8`}>
            What do you want to buy?
          </Text>
          <ServicesPanel style={tw`mt-6`} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
