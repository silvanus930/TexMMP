import * as React from 'react';
import { View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StartScreen from 'screen/StartScreen';
import HomeScreen from 'screen/HomeScreen';
import RecordingScreen from 'screen/RecordingScreen';
import PostScreen from 'screen/PostScreen';

const Stack = createNativeStackNavigator();

const UnauthenticatedNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="StartScreen">
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RecordingScreen"
        component={RecordingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default UnauthenticatedNavigation;
