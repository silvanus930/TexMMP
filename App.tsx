import React from 'react';
import {LogBox} from 'react-native';
import UnauthenticatedNavigation from 'src/navigation/UnauthenticatedNavigation';
import {NavigationContainer} from '@react-navigation/native';

LogBox.ignoreAllLogs();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <UnauthenticatedNavigation />
    </NavigationContainer>
  );
}

export default App;
