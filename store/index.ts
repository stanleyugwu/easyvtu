import create from 'zustand';
import {SignInResData as Profile} from '../api/services/auth';

type UserProfile = Profile;
export type AppStore = {
  profile?: UserProfile;
  setProfile(profile: Partial<UserProfile>): void;
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
const useAppStore = create<AppStore>(set => ({
  profile: undefined,
  setProfile(profile) {
    // we don't merge updates with existing profile
    // because we don't want to mistakenly add an alien
    // field to profile from profile update payload.
    // we want to only read and update the valid fields
    set(state => {
      const newProfile = keys.reduce<UserProfile>((prev, key) => {
        return Object.defineProperty(prev, key, {
          value: profile[key] || prev[key],
          writable: true,
        });
      }, state.profile || ({} as UserProfile));
      return {profile: newProfile};
    });
  },
}));

export default useAppStore;
