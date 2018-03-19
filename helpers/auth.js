import React from 'react';

import {
    AsyncStorage,
    Alert
} from 'react-native';

import baseUrl from './../constants/api';

export function isTokenValid() {
    return AsyncStorage.getItem('Token').then((token) => {
        return fetchFirst(token).then((result) => {
            return result;
        })
    });
}

function fetchFirst(token) {
    return fetch(baseUrl + '/products/paginate/1/1?api_token=' + token)
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.message != undefined && responseJson.message != null) {
                if(responseJson.message.indexOf('not allowed') >= 0) {
                    return false;
                }
            }
            return true;
        });
}

export function logout() {
    AsyncStorage.removeItem('User');
    AsyncStorage.removeItem('Token');
    Alert.alert('Your session has been expired. Please sign in.');
}