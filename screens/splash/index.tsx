import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import StepperDots from './components/StepperDots';
import SplashScene from './components/SplashScene';
import tw from '../../lib/tailwind';
import Text from '~components/Text';
import Button from '~components/Button';
import * as Animatable from 'react-native-animatable';
import { StackScreen } from '../../navigation/screenParams';

import scene1Img from './images/scene1.png';
import scene2Img from './images/scene2.png';
import scene3Img from './images/scene3.png';

type SceneIndex = 1 | 2 | 3;
const SplashScreen = ({navigation}:StackScreen<"Splash">) => {
  const svref = useRef<ScrollView>(null);
  const {width: screenWidth} = useWindowDimensions();
  const [activeSceneIndex, setActiveSceneIndex] = useState<SceneIndex>(1);

  /**
   * Handles updating stepper counter dots
   */
  const incrementStepper = (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
    /**
     * In below logic, we determine whether user scrolled to new screen by checking if he
     * scrolled at least halfway past the current screen.
     * By horizontal, paging-enabled ScrollView's design, Scrolling halfway past the current
     * screen will show the next screen
     */
    const scrollX = evt.nativeEvent.contentOffset?.x;
    const halfScreen = screenWidth / 2;

    if (activeSceneIndex === 1) {
      // scroll happened in first scene
      if (scrollX >= halfScreen) {
        // user dragged halfway the screen
        // meaning second screen is visible
        setActiveSceneIndex(2);
      }
    } else if (activeSceneIndex === 2) {
      // scroll happened in second screen
      if (scrollX - screenWidth >= halfScreen) {
        // scrolled forward
        setActiveSceneIndex(3);
      } else if (scrollX < halfScreen) {
        // scrolled backward
        setActiveSceneIndex(1);
      }
    } else {
      // scroll happened in third screen
      if (scrollX - screenWidth * 2 < -halfScreen) {
        setActiveSceneIndex(2);
      }
    }
  };

  const handleCtaBtnPress = () => {
    if (activeSceneIndex < 3) {
      // scrolls to next screen when next button is pressed
      svref.current?.scrollTo({x: screenWidth * activeSceneIndex});
      setActiveSceneIndex((activeSceneIndex + 1) as SceneIndex);
    } else {
      // handle get started
      navigation.navigate("Landing")
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-row justify-between items-center p-4`}>
        <StepperDots activeIndex={activeSceneIndex} />
        {activeSceneIndex != 3 ? (
          <Text
            color="primary"
            onPress={() => {
              svref.current?.scrollToEnd({animated: true});
              setActiveSceneIndex(3);
            }}>
            SKIP
          </Text>
        ) : (
          <Text />
        )}
      </View>
      <ScrollView contentContainerStyle={tw`h-full justify-around`}>
        <Animatable.View animation={'fadeInUp'} style={tw`justify-between`}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScrollEndDrag={incrementStepper}
            pagingEnabled
            onMomentumScrollEnd={incrementStepper}
            ref={svref}>
            <SplashScene
              body="ksdfkfkdsdksdd sjdf dsh fj ds sdsd  d sjdsd"
              title="Easy"
              image={scene1Img}
            />
            <SplashScene
              body="ksdfkfkdsdksdd ksdfkfkdsdksdd sjdf dsh fj ds sdsd  d sjdsd"
              title="Fast"
              image={scene2Img}
            />
            <SplashScene
              body="ksdfkfkdsdksdd ksdfkfkdsdksdd sjdf dsh fj ds sdsd  d sjdsd"
              title="Seamlessly"
              image={scene3Img}
            />
          </ScrollView>
        </Animatable.View>
        <Button
          label={activeSceneIndex < 3 ? 'Next' : 'Get started'}
          onPress={handleCtaBtnPress}
          style={tw`mx-4 mb-8`}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SplashScreen;
