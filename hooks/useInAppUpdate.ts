import {useCallback, useEffect} from 'react';
import {Platform} from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

/**
 * Custom hook that handles in-app update for android and iOS
 */
const useInAppUpdate = () => {
  const checkInAppUpdate = useCallback(() => {
    const inAppUpdates = new SpInAppUpdates(
      false, // isDebug
    );

    return inAppUpdates
      .checkNeedsUpdate()
      .then(result => {
        if (result.shouldUpdate) {
          // @ts-ignore
          const updateOptions: StartUpdateOptions = Platform.select({
            ios: {
              title: 'Update available',
              message:
                'There is a new version of EasyVtu available on the App Store, do you want to update it?',
              buttonUpgradeText: 'Update',
              buttonCancelText: 'Cancel',
            },
            android: {
              // we use flexible update here unless we see 'hotfix' in the latest app's versionName
              // The reason is, We hope to fix all critical bugs via JS bundle.
              // And we can also update the bundle to block app interface when an update is critical
              // CHORE: append 'hotfix' to future version names for critical store updates
              updateType: result?.storeVersion?.includes('hotfix')
                ? IAUUpdateKind.IMMEDIATE
                : IAUUpdateKind.FLEXIBLE,
            },
          });
          inAppUpdates.startUpdate(updateOptions);
        }
      })
      .catch(console.warn);
  }, []);

  useEffect(() => {
    checkInAppUpdate();
  }, []);
};

export default useInAppUpdate;
