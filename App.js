import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import LogScreen from './src/screens/LogScreen';

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: LogScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode:'none'
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}