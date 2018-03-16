import React, { Component } from 'react';

import {
    TabNavigator,
    StackNavigator
} from 'react-navigation';

import ProductListPage from './../components/ProductListPage';
import ProductAddPage from './../components/ProductAddPage';
import ProductEditPage from './../components/ProductEditPage';
import ProductDetailPage from './../components/ProductDetailPage';
import ProfilePage from './../components/ProfilePage';

const StackNavigation = StackNavigator({
  ProductList: { screen: ProductListPage },
  ProductEdit: { screen: ProductEditPage },
  ProductDetail: { screen: ProductDetailPage }
});

const AddProductNavigation = StackNavigator({
  ProductAdd: { screen: ProductAddPage }
});

export default Tabs = TabNavigator({
  List: {
    screen: StackNavigation,
    navigationOptions: {
      tabBarLabel: 'List',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
    },
  },
  Add: {
    screen: AddProductNavigation,
    navigationOptions: {
      tabBarLabel: 'Add New',
      tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={35} color={tintColor} />
    },
  },
  Profile: {
    screen: ProfilePage,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon name="user" size={35} color={tintColor} />
    },
  }
}, {
  animationEnabled: true
});
