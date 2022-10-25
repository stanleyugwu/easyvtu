import create from 'zustand';
import {SignInResData as Profile} from '../api/services/auth';
import {persist} from 'zustand/middleware';
import {MMKVLoader} from 'react-native-mmkv-storage';

// storage instance for persisting app store
export const storeStorage = new MMKVLoader()
  .withInstanceID('app_store')
  .initialize();

type UserProfile = Profile;
export type AppStore = {
  profile?: UserProfile;
  setProfile(profile: Partial<UserProfile>): void;
  isLoggedIn: boolean;
  signOut(): void;
  signIn(): void;
};

const keys: (keyof UserProfile)[] = [
  'account_name',
  'account_number',
  'bank_name',
  'created_at',
  'email',
  'email_verified_at',
  'firstname',
  'id',
  'image',
  'isAdmin',
  'isVerified',
  'lastname',
  'no_of_referrals',
  'phone',
  'refer_by',
  'unique_id',
  'updated_at',
  'username',
  'wallet_balance',
];
const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      profile: undefined,
      setProfile(profile) {
        if (!get().profile) return set({profile: profile as UserProfile});
        // we don't merge updates with existing profile
        // because we don't want to mistakenly add an alien
        // field to profile from profile update payload.
        // we want to only read and update the valid fields
        set(({profile: prevProfile}) => {
          const newProfile = {} as UserProfile;
          keys.forEach(key => {
            Object.defineProperty(newProfile, key, {
              value: profile[key] || prevProfile![key],
              writable: true,
            });
          });
          return {profile: {...prevProfile, ...profile}} as AppStore;
        });
      },
      isLoggedIn: false,
      signIn() {
        set({isLoggedIn: true});
      },
      signOut() {
        // @ts-ignore
        globalThis.$token$ = undefined; // remove global token
        globalThis.secureStorage.removeItem('__$auth_token$__'); // remove persisted token
        set({isLoggedIn: false, profile: undefined}); // refresh app and clear profile
      },
    }),
    {
      name: '__easyvtu-store__',
      // @ts-ignore
      getStorage: () => storeStorage,
    },
  ),
);

export default useAppStore;
