//import libraries
import React from 'react';
import {Linking, View, ViewProps} from 'react-native';
import Text, {TextProps} from '../../components/Text';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '../../components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';

// images
import EmailIcon from '~images/mail.svg';
import CellPhoneIcon from '~images/cellphone.svg';
import TwitterIcon from '~images/twitter.svg';
import FacebookIcon from '~images/facebook.svg';
import InstagramIcon from '~images/instagram.svg';
import LinkedInIcon from '~images/linkedin.svg';
import WhatsappIcon from '~images/whatsapp.svg';
import CONTACT from '../../utils/constants/contact';
import normalisePhoneNumber from '../../utils/normalisePhoneNumber';

// TODO: use appropriate contact details

// Flex-row View shorthand
const DetailRowView = ({children, ...otherProps}: ViewProps) => (
  <View style={tw`flex-row my-2`} {...otherProps}>
    {children}
  </View>
);

// Text shorthand
const Detail = (props: TextProps) => (
  <Text
    color="black"
    style={tw`ml-2`}
    android_hyphenationFrequency="normal"
    {...props}
  />
);

// Linking shorthand
const gotoUrl = (url: string) => () => Linking.openURL?.(url);

// Conact Support Screen Component
const Support = () => {
  return (
    <SafeAreaScrollView>
      <AppHeader
        title="Reach out to us"
        subTitle="For support, reports, or enquiries, reach out to us
via any of the below channels."
      />

      <View style={tw`bg-white rounded-lg p-4 mt-6`}>
        <DetailRowView>
          <EmailIcon />
          <Detail dataDetectorType={'email'}>{CONTACT.EMAIL}</Detail>
        </DetailRowView>
        <DetailRowView>
          <CellPhoneIcon />
          <Detail dataDetectorType="phoneNumber">{CONTACT.PHONE}</Detail>
        </DetailRowView>
        <DetailRowView>
          <FacebookIcon />
          <TwitterIcon style={tw`mx-2`} />
          <InstagramIcon />
          <LinkedInIcon style={tw`ml-2`} />
          <Detail onPress={gotoUrl(`https://twitter.com/${CONTACT.TWITTER}`)}>
            @{CONTACT.FACEBOOK}
          </Detail>
        </DetailRowView>
        <DetailRowView>
          <WhatsappIcon />
          <Detail
            dataDetectorType={'all'}
            onPress={gotoUrl(
              `https://wa.me/${normalisePhoneNumber(CONTACT.WHATSAPP)}`,
            )}>
            {CONTACT.WHATSAPP}
          </Detail>
        </DetailRowView>
      </View>
    </SafeAreaScrollView>
  );
};

export default Support;
