import React, { Component } from 'react';

import {
    Text,
    TouchableOpacity,
    View,
    AsyncStorage
} from 'react-native';

import styles from './../styles/Styles';

export default class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('User').then((user) => {
            if(user != null && user != undefined) {
                const userObject = JSON.parse(user);
                this.setState({
                    email: userObject.email
                });
            } else {
                this.setState({
                    email: 'unidentified@mail.com'
                });
            }
        });
    }

    Logout = () => {
        AsyncStorage.removeItem('Token');
        AsyncStorage.removeItem('User');
        this.props.navigation.navigate('Login');
    }

    render() {
        return <View style={styles.FormContainer}>
                    <Text>{this.state.email}</Text>
                    <TouchableOpacity 
                        activeOpacity = { .4 } 
                        style={styles.TouchableOpacityStyle} 
                        onPress={this.Logout}>
                            <Text style={styles.TextStyle}> Sign Out </Text>
                    </TouchableOpacity>
                </View>;
    }
}