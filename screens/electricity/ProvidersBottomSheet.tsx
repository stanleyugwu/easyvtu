//import libraries
import React from 'react';
import {UseQueryResult} from 'react-query';
import {SuccessObject} from '../../api/api';
import {ElectricityProviderName} from './providerImageIds';
import BottomSheet, {BOTTOMSHEETHEIGHT} from '~components/BottomSheet';
import FlatViewLoader from '~components/FlatViewLoader';
import FlatViewError from '~components/FlatViewError';
import ElectricityProvider from './ElectricityProvider';
import tw from '../../lib/tailwind';

interface ElectricityProvidersBottomSheetProps {
  /**
   * Request query object for determining query states (loading, error, data)
   */
  queryInterface: UseQueryResult<
    SuccessObject<ElectricityProviderName[]>,
    unknown
  >;

  /**
   * Whether bottom sheet is visible
   */
  visible: boolean;

  /**
   * Called when sheet is dismissed
   */
  onDismiss: () => void;

  /**
   * Called when provider is selected
   */
  onSelect: (selectedProvider: ElectricityProviderName) => void;
}

// Composite component for disco providers selection
const ElectricityProvidersBottomSheet = ({
  onDismiss,
  visible,
  queryInterface,
  onSelect,
}: ElectricityProvidersBottomSheetProps) => {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      title="Select Electricity Provider"
      height={BOTTOMSHEETHEIGHT.THREE_QUATER}>
      <FlatViewLoader
        visible={queryInterface.isLoading}
        text="Loading electricity providers"
        style={tw`mt-4`}
      />
      <FlatViewError
        visible={queryInterface.isLoadingError}
        onRetry={queryInterface.refetch}
        style={tw`mt-4`}
      />
      {queryInterface.data?.data?.map?.(provider => (
        <ElectricityProvider
          label={provider.toLowerCase() as typeof provider}
          key={provider}
          onPress={() => onSelect(provider)}
        />
      ))}
    </BottomSheet>
  );
};

export default ElectricityProvidersBottomSheet;
