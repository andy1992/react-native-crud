import React, { Component } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import styles from './../styles/Styles';

export default class LoginPage extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isFormValid: true,
            apiResult: '',
            isLoading: false
        }
    }

    static navigationOptions = {
        title: 'Sign In',
        headerLeft: null
    };

    async SaveToken (key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            Alert.alert('Failed to authenticate user. Please try again later.');
        }
    }

    Authenticate = () => {
        if(this.state.email == null || this.state.email.length == 0) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Email field is required' 
            });
        } else if(this.state.password == null || this.state.password.length == 0) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Password field is required' 
            });
        } else {
            this.setState({
                isFormValid: true,
                errorMessage: '',
                isLoading: true
            });

            fetch('http://api.rotimonas.com/v1/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    apiResult: responseJson.toString()
                });
                if(responseJson.success) {
                    this.setState({
                        isLoading: false
                    });
                    // Save api token to asyncstorage
                    this.SaveToken('User', responseJson);

                    // Redirect to ProductListPage
                } else {
                    this.setState({
                        isLoading: false,
                        errorMessage: 'Invalid email / password combination'
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    renderError = () => {
        if(!this.state.isFormValid) {
            return <Text style={{
                color: 'red'
            }}>
                {this.state.errorMessage}
            </Text>
        } else {
            return null;
        }
    }

    render() {
        return(
            <View style={styles.FormContainer}>
                <Text style={{fontSize: 20, marginRight: 25, textAlign: 'center', marginBottom: 7}}>
                    Sign In   
                </Text>

                <TextInput
                    placeholder='Email'
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            email: value
                        })
                    }
                    onSubmitEditing={(event) => { 
                        this.refs.txtDescription.focus(); 
                    }}
                    value={this.state.email} />
                    
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            password: value
                        })
                    }
                    onSubmitEditing={(event) => { 
                        this.refs.txtQuantity.focus(); 
                    }}
                    value={this.state.password} />

                {this.renderError()}

                <TouchableOpacity 
                    activeOpacity = { .4 } 
                    style={styles.TouchableOpacityStyle} 
                    onPress={this.Authenticate}>
                        <Text style={styles.TextStyle}> Sign In </Text>
                </TouchableOpacity>
            </View>
        );
    }
}