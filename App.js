import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  Alert
} from 'react-native';

import {
  StackNavigator
} from 'react-navigation';

import Tabs from './routers/Tabs';

import LoginPage from './components/LoginPage';

import { updateFocus, getCurrentRouteKey } from 'react-navigation-is-focused-hoc'

const StackNavigation = new StackNavigator({
  Products: {
    screen: Tabs
  },
  Login: {
    screen: LoginPage
  }
});

export default class App extends Component {
  render() {
    /*const apiToken = AsyncStorage.getItem('Token').then((token) => {
        if(token != null && token != undefined) {
          return token;
        } else {
          return null;
        }
    });
    
    if(apiToken != null) {
      return <Tabs 
            onNavigationStateChange={(prevState, currentState) => {
              updateFocus(currentState)
            }} />;
    } else {
      return <LoginPage />;
    }*/
    return <StackNavigation 
            onNavigationStateChange={(prevState, currentState) => {
              updateFocus(currentState)
            }} />;
  }
}