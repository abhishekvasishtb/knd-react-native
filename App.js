import React from 'react';
import {StyleSheet} from 'react-native';
// import LoginScreen from './LoginScreen.js';
import { createSwitchNavigator, createStackNavigator} from 'react-navigation';

import TableScreen from './src/components/content/drawerScreen.js';
import LoginScreen from './src/components/login/login.js';
import AuthLoadingScreen from './src/components/login/AuthLoadingScreen.js';


const AuthStack = createStackNavigator({ SignIn: LoginScreen });

export default createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        App: TableScreen,
    },
    {
        initialRouteName: 'AuthLoading'
    }
)
