import React, { Component } from 'react';

import {
    TabNavigator,
    StackNavigator,
    Icon
} from 'react-navigation';

import Tabs from './../routers/Tabs';
import LoginPage from './../components/LoginPage';

export default StackNavigation = new StackNavigator({
  Login: {
    screen: LoginPage
  },
  Products: {
    screen: Tabs
  },
}, {
  headerMode: 'none'
});