//import libraries
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {UseBaseQueryResult} from 'react-query';
import BottomSheet, {BOTTOMSHEETHEIGHT} from '~components/BottomSheet';
import FlatViewError from '~components/FlatViewError';
import FlatViewLoader from '~components/FlatViewLoader';
import Text from '~components/Text';
import {SuccessObject} from '../../api/api';
import {ServicePlansResData} from '../../api/services/getServicePlans';
import {ArrayElementType} from '../../global';
import tw from '../../lib/tailwind';
import {CableNetwork} from './CableSelector';

interface CableNetworksBottomSheetProps {
  /**
   * Request query object for determining query states (loading, error, data)
   */
  queryInterface: UseBaseQueryResult<
    SuccessObject<ServicePlansResData>,
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
  onSelect: (
    selectedCablePlan: Omit<
      ArrayElementType<ServicePlansResData['variations']>,
      'fixedPrice'
    >,
  ) => void;

  /**
   * Cable network
   */
  cableNetwork: CableNetwork;
}

// CableNetworksBottomSheet Component
const CableNetworksBottomSheet = ({
  onDismiss,
  onSelect,
  queryInterface,
  visible,
  cableNetwork = CableNetwork.Dstv
}: CableNetworksBottomSheetProps) => {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      title={`Choose a ${cableNetwork} plan`}
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
      {queryInterface.data?.data?.variations?.map((cablePlan, idx) => (
        <TouchableOpacity
          key={idx}
          activeOpacity={0.8}
          style={tw`py-2`}
          onPress={() => {
            onSelect({
              name: cablePlan.name,
              variation_amount: cablePlan.variation_amount,
              variation_code: cablePlan.variation_code,
            });
          }}>
          <Text>{cablePlan.name}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheet>
  );
};

export default CableNetworksBottomSheet;
