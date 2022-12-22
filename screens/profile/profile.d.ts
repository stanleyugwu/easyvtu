import useAppStore from "../../store";

export interface ProfileUpdateInputs {
  email: string;
  username: string;
  phoneNumber: string;
}

export type UpdateProfileDetailsBody = Omit<
  ProfileUpdateInputs,
  'phoneNumber'
> & {phone:string};

export type UpdateProfilePicBody = {image:string}

type SetProfileFn = ReturnType<typeof useAppStore['getState']>['setProfile']
export type ProfileUpdateRes = Parameters<SetProfileFn>[0]

