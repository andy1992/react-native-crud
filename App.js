/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
  Login: {
    screen: LoginPage
  },
  Products: {
    screen: Tabs
  }
});

export default class App extends Component {
  render() {
    let result = AsyncStorage.getItem('User').then((user) => {
        if(user == null || user == undefined) {
          return null;
        } else {
          return user;
        }
    });

    if(result != null && result != undefined) {
        return <Tabs
                  onNavigationStateChange={(prevState, currentState) => {
                    updateFocus(currentState)
                  }} />;
    } else {
        return <LoginPage />;
    }
  }
}