//import libraries
import React, { useEffect } from 'react';
import {View, Image, ScrollView, TouchableOpacity} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import useAppStore from '../../store';
import UserIcon from '../../assets/images/user.svg';
import Menu from '../../assets/images/menu.svg';
import ServicesPanel from '~components/ServicesPanel';
import {SafeAreaView} from 'react-native-safe-area-context';
import Wallet from '~components/Wallet';
import {TabScreen} from '../../navigation/screenParams';
import constants from '../../utils/constants';
import {SignInResData} from '../../api/services/auth';
import useInAppUpdate from '../../hooks/useInAppUpdate';

// Home Screen Component
const Home = ({navigation: {navigate}}: TabScreen<'Home'>) => {
  const {username, image} = useAppStore(
    state => state.profile || ({} as SignInResData),
  );

  // in-app update
  useInAppUpdate();

  if (!username && !image) return null;

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
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView style={tw`bg-gray5`}>
        <View style={tw`bg-primary`}>
          <View style={tw`flex-row justify-between items-center p-4 mb-16`}>
            {/* Account Profile */}
            <View style={tw`flex-row items-center`}>
              {/* Account image */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigate('Profile')}
                style={tw`w-14 h-14 bg-white rounded-full justify-center items-center`}>
                {image ? (
                  <Image
                    source={{uri: constants.SERVER_URL + image}}
                    style={tw`w-full h-full rounded-full`}
                  />
                ) : (
                  // @ts-ignore
                  <UserIcon width="35px" height="35px" />
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
              width="35"
              height="35"
            />
          </View>

          <View style={tw`p-4 bg-gray5 rounded-t-[30px] bottom-0 h-full`}>
            <View style={tw`-mt-16`}>
              <Wallet
                onAddMoneyBtnPress={handleAddMoney}
                onWithdrawMoneyBtnPress={handleWithdrawMoney}
              />
            </View>
            <Text type="paragraph" color="black" style={tw`mt-6 font-bold`}>
              TOP UP NOW
            </Text>
            <ServicesPanel style={tw`mt-6`} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
