//import libraries
import React, { useEffect } from 'react';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import AppHeader from '~components/AppHeader';
import ServicesPanel from '~components/ServicesPanel';
import useInAppUpdate from '../../hooks/useInAppUpdate';

// Guest Home Screen Component
const GuestHome = () => {
  // in-app update
  useInAppUpdate();

  return (
    <SafeAreaScrollView>
      <AppHeader
        title="Top-up without an account"
        subTitle="You can enjoy the services of Easy-vtu without creating an account, but to enjoy all the services and features, you have to have an account."
      />
      <ServicesPanel />
    </SafeAreaScrollView>
  );
};

export default GuestHome;
