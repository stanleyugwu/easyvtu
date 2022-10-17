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

