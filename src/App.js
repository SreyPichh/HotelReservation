/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
// import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Home from './scenes/Home'

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'


const Stack = createNativeStackNavigator();


class App extends Component {
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
          name="Home"
          component= {Home}
          options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;
