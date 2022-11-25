//import libraries
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import tw from '../../lib/tailwind';

import DstvLogo from '~images/dstv.svg';
import GotvLogo from '~images/gotv.svg';
import StartimesLogo from '~images/startimes.svg';

export enum CableNetwork {
  Dstv = 'dstv',
  Gotv = 'gotv',
  Startimes = 'startimes',
}

interface CableSelectorProps {
  onSelect: (selectedNetwork: CableNetwork) => void;
}

const networks = Object.values(CableNetwork);

// Component for selecting cable network
const CableSelector = ({onSelect}: CableSelectorProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<CableNetwork>(
    CableNetwork.Dstv,
  );

  return (
    <View style={tw`flex-row`}>
      {networks.map(cable => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setSelectedNetwork(cable);
            onSelect(cable);
          }}
          key={cable}
          style={tw.style(
            `p-2 rounded-md sm:mr-5 border-2 border-gray5`,
            selectedNetwork === cable ? 'bg-white border-primary' : 'bg-gray5',
          )}>
          {React.createElement(
            cable === CableNetwork.Dstv
              ? DstvLogo
              : cable === CableNetwork.Gotv
              ? GotvLogo
              : StartimesLogo,
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CableSelector;
