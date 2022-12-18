//import libraries
import React, {useState} from 'react';
import {Image, View} from 'react-native';
import Text from '~components/Text';
import tw from '../../lib/tailwind';
import SafeAreaScrollView from '~components/SafeAreaScrollView';
import {TabScreen} from '../../navigation/screenParams';
import useAppStore from '../../store';
import Button from '~components/Button';
import InputField from '~components/InputField';
import {format} from 'timeago.js';
import BackButton from '~components/BackButton';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import SnackBar from '~components/SnackBar';
import getFirstError from '../../utils/getFirstError';
import Loader from '~components/Loader';
import SuccessOverlay from '~components/SuccessOverlay';
import constants from '../../utils/constants';

import {useQuery} from 'react-query';
import _axios from '../../api/axios';
import {ServerErrorObject} from '../../api/api';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import profileSchema from './profile.schema';

import UserIcon from '~images/user.svg';
import NigeriaFlag from '~images/nigeria_flag.svg';

import type {ProfileUpdateInputs, UpdateProfileDetailsBody} from './profile';
import requestInAppReview from '../../utils/requestInAppReview';
import useInAppUpdate from '../../hooks/useInAppUpdate';

// TODO: request to make auth token non-expiring

// Profile Screen Component
const Profile = ({navigation: {navigate, goBack}}: TabScreen<'Profile'>) => {
  // in-app update
  useInAppUpdate();

  const profile = useAppStore(state => state.profile!);
  const [editingProfile, setEditingProfile] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<Asset | undefined>(
    undefined,
  );
  const [successModalText, setSuccessModalext] = useState('');
  const updateProfile = useAppStore(state => state.setProfile);

  // handles back button press
  const handleBackPress = React.useCallback(() => {
    if (editingProfile) {
      setEditingProfile(false);
      setUploadedImage(undefined);
    } else goBack();
  }, [editingProfile, uploadedImage?.uri]);

  // handles profile pic change
  const handleChangePicture = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      presentationStyle: 'formSheet',
      includeExtra: false,
      selectionLimit: 1,
      quality: 1,
    });
    if (!result.didCancel && result.assets?.length) {
      setUploadedImage(result.assets[0]);
    }
  };

  // form validation manager
  const {
    handleSubmit,
    clearErrors,
    setValue,
    control: {_defaultValues: defaultValues},
    getValues,
    formState: {errors},
  } = useForm<ProfileUpdateInputs>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      email: profile.email,
      phoneNumber: profile.phone,
      username: profile.username,
    },
  });

  // request query manager for profile details
  const [profileUpdateServerError, setProfileUpdateServerError] = useState('');
  const profileUpdateQuery = useQuery(
    'update_profile',
    () =>
      _axios.post<
        UpdateProfileDetailsBody,
        // TODO: move request return type to type variable
        Parameters<typeof updateProfile>[0]
      >('/update_profile', {
        email: getValues('email'),
        phone: getValues('phoneNumber'),
        username: getValues('username'),
      }),
    {
      onError(err: ServerErrorObject) {
        // we're adding this listener to be able to extract the error
        // and make it detectable and removable by error snackbar
        setProfileUpdateServerError(
          err?.message || 'An error occurred while updating profile',
        );
      },
      onSuccess(data) {
        setSuccessModalext('Profile updated successfully');
        updateProfile(data.data);
        requestInAppReview();
      },
      enabled: false,
    },
  );

  // request query manager for profile pic
  const [profilePicUpdateServerError, setProfilePicUpdateServerError] =
    useState('');
  const profilePicUpdateQuery = useQuery(
    'update_profile_picture',
    () => {
      // because we're uploading an image, and there's no server implementation
      // supporting image blob or base64 upload yet, we upload image via `FormData` object
      const formData = new FormData();
      formData.append('image', {
        name: uploadedImage?.fileName,
        type: uploadedImage?.type,
        uri: uploadedImage?.uri,
      });

      return _axios.post<FormData, Parameters<typeof updateProfile>[0]>(
        '/change_picture',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );
    },
    {
      onError(err: ServerErrorObject) {
        // we're adding this listener to be able to extract the error
        // and make it detectable and removable by error snackbar
        setProfilePicUpdateServerError(
          err?.message || 'An error occurred while updating profile picture',
        );
      },
      onSuccess(data) {
        setSuccessModalext('Profile updated successfully');
        updateProfile(data.data);
        requestInAppReview();
      },
      enabled: false,
    },
  );

  // handles updating profile info and pic after validation
  const handleUpdateProfile = handleSubmit(async values => {
    // we first check if something actually changed before hiting server
    // if user didn't update any field we just cancel editing instead of
    // wasting user's bandwidth disturbing server
    const detailsChanged =
      Object.values(values).join('') !== Object.values(defaultValues).join('');
    const nothingChanged = !detailsChanged && !uploadedImage?.uri;

    if (nothingChanged) {
      // we use this function to reset editing state and uploaded image
      handleBackPress();
    } else {
      // something changed
      // now we have to requests to make, one for profile pic update (if profile pic changed)
      // and the other for profile details update
      if (uploadedImage?.uri) {
        // user changed profile pic
        profilePicUpdateQuery.refetch();
      }
      if (detailsChanged) profileUpdateQuery.refetch();
    }
  });

  return (
    <>
      <SafeAreaScrollView backgroundColor="white">
        {/* Header */}
        <View style={tw`flex-row items-center mb-2`}>
          <BackButton onPress={handleBackPress} />
          <Text type="title" color="black" style={tw`ml-5`}>
            {editingProfile ? 'Editing Profile' : 'Profile Details'}
          </Text>
        </View>

        {/* Profile Image and Edit button */}
        <View style={tw`flex-row items-center my-4`}>
          <View
            style={tw`w-24 h-24 bg-gray5 rounded-full mr-4 justify-center items-center`}>
            {profile.image || uploadedImage?.uri ? (
              <Image
                source={{
                  uri:
                    uploadedImage?.uri || constants.SERVER_URL + profile.image,
                }}
                style={tw`w-full h-full rounded-full`}
              />
            ) : (
              <UserIcon width="55px" height="55px" />
            )}
            <View
              style={tw.style(
                'absolute bottom-0 -right-10 rounded-lg p-1.5 bg-primary flex-row',
                !editingProfile && 'hidden',
              )}>
              <Text type="caption" color="white" onPress={handleChangePicture}>
                CHANGE
              </Text>
            </View>
          </View>
          <Button
            label="Edit profile"
            onPress={() => setEditingProfile(true)}
            style={tw.style(editingProfile && 'hidden')}
          />
        </View>
        <InputField
          label="Username"
          disableFullscreenUI
          placeholder={defaultValues.username!}
          focusable={editingProfile}
          editable={editingProfile}
          onChangeText={v => setValue('username', v)}
          defaultValue={defaultValues.username}
        />
        <InputField
          label="Phone Number"
          placeholder={defaultValues.phoneNumber!}
          disableFullscreenUI
          leftElement={<NigeriaFlag style={tw`mx-4`} />}
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          focusable={editingProfile}
          editable={editingProfile}
          onChangeText={v => setValue('phoneNumber', v)}
          defaultValue={defaultValues.phoneNumber}
        />
        <InputField
          label="Email address"
          placeholder={defaultValues.email!}
          keyboardType="email-address"
          disableFullscreenUI
          textContentType="emailAddress"
          focusable={editingProfile}
          editable={editingProfile}
          onChangeText={v => setValue('email', v)}
          defaultValue={defaultValues.email}
        />
        {!editingProfile ? (
          <InputField
            label="Registeration date"
            placeholder={format(new Date(profile.created_at))}
            focusable={false}
            editable={false}
            value={format(new Date(profile.created_at))}
          />
        ) : (
          <InputField
            label="Password"
            placeholder="******************"
            secureTextEntry
            value={'******************'}
            editable={false}
            focusable={false}
            rightElement={
              <Text
                onPress={() => navigate('ChangePassword')}
                style={tw`px-2`}
                color="secondary"
                type="caption">
                CHANGE
              </Text>
            }
          />
        )}

        <Button
          label="Save changes"
          style={tw.style(`mt-4`, !editingProfile && 'hidden')}
          onPress={handleUpdateProfile}
        />
      </SafeAreaScrollView>
      {/* Here we use same snackbar to show validation, profile update, and image upload erros */}
      <SnackBar
        text={
          getFirstError(errors) ||
          profileUpdateServerError ||
          profilePicUpdateServerError
        }
        onDismiss={() => {
          // because we're listening for error from 3 sources
          // we clear all 3 errors after snackbar timeout
          clearErrors();
          setProfilePicUpdateServerError('');
          setProfileUpdateServerError('');
        }}
      />

      {/* Loader */}
      <Loader
        visible={
          profileUpdateQuery.isFetching || profilePicUpdateQuery.isFetching
        }
      />

      {/* Success overlay */}
      <SuccessOverlay
        visible={!!successModalText}
        onDismiss={() => setSuccessModalext('')}
        successText={successModalText}
      />
    </>
  );
};

export default Profile;
