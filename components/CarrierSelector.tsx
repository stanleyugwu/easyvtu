//import libraries
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import tw from '../lib/tailwind';
import {Carrier} from '../screens/airtime/airtime.d';

// image assets
import MtnIcon from '~images/mtn_logo.svg';
import AirtelIcon from '~images/airtel_logo.svg';
import EtisalatIcon from '~images/etisalat_logo.svg';
import GloIcon from '~images/glo_logo.svg';

interface CarrierSelectorProps {
  /**
   * Determines the active carrier network
   */
  selected?: Carrier;
}

// network object for rendering
const networks: [
  NetworkName: Carrier,
  NetworkIcon: typeof MtnIcon,
  NetworkId: number,
][] = [
  [Carrier.Mtn, MtnIcon, 1],
  [Carrier.Airtel, AirtelIcon, 2],
  [Carrier.Etisalat, EtisalatIcon, 3],
  [Carrier.Glo, GloIcon, 4],
];

/** renders individual network carrier */
type NetworkProps = {
  active: boolean;
  ServiceImage: typeof MtnIcon;
};
const Network = ({ServiceImage, active}: NetworkProps) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={tw.style(
      `p-2 rounded-md sm:mr-5 border-2 border-gray5`,
      active ? 'bg-white border-primary' : 'bg-gray5',
    )}>
    <ServiceImage />
  </TouchableOpacity>
);

/**
 * Carrier selector component for selecting a carrier network for top-up
 * carrier selection for top ups will be based on automatic carrier network
 *  detection from phone number. We dont allow user select carrier manually
 */
const CarrierSelector = ({selected = Carrier.Mtn}: CarrierSelectorProps) => {
  return (
    <View style={tw`flex-row justify-between sm:justify-start`}>
      {networks.map(network => (
        <Network
          ServiceImage={network[1]}
          active={selected === network[0]}
          key={network[2]}
        />
      ))}
    </View>
  );
};

export default CarrierSelector;
