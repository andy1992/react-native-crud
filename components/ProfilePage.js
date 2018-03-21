import React, { Component } from 'react';

import {
    Text,
    TouchableOpacity,
    View,
    AsyncStorage
} from 'react-native';
import {
    isTokenValid,
    logout
} from './../helpers/auth';

import styles from './../styles/Styles';

export default class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    static navigationOptions = {
        title: 'Profile'
    };

    componentDidMount() {
        isTokenValid().then((value) => {
            if(!value) {
                logout();
                this.props.navigation.navigate('Login');
            } else {
                AsyncStorage.getItem('User').then((user) => {
                    if(user != null && user != undefined) {
                        const userObject = JSON.parse(user);
                        this.setState({
                            email: userObject.email
                        });
                    } else {
                        logout();
                    }
                });
            }
        });
    }

    Logout = () => {
        logout();
        this.props.navigation.navigate('Login');
    }

    render() {
        return <View style={styles.FormContainer}>
                    <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 20,
                        marginBottom: 10
                    }}>Hi, {this.state.email}</Text>
                    <TouchableOpacity 
                        activeOpacity = { .4 } 
                        style={styles.TouchableOpacityStyle} 
                        onPress={this.Logout}>
                            <Text style={styles.TextStyle}> Sign Out </Text>
                    </TouchableOpacity>
                </View>;
    }
}