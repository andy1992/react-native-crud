import React, { Component } from 'react';

import {
  StackNavigator
} from 'react-navigation';

import Tabs from './routers/Tabs';

import LoginPage from './components/LoginPage';

import { updateFocus, getCurrentRouteKey } from 'react-navigation-is-focused-hoc'

import StackNavigation from './routers/Main';

export default class App extends Component {
  render() {
    return <StackNavigation 
            screenProps={{...this.state}}
            onNavigationStateChange={(prevState, currentState) => {
              updateFocus(currentState)
            }} />;
  }
}