import React, { Component } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';

import {
    baseUrl
} from './../constants/api';

import {
    isTokenValid
} from './../helpers/auth';

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

    componentDidMount() {
        AsyncStorage.getItem('Token').then((token) => {
            return fetch('http://api.rotimonas.com/v1/products/paginate/1/1?api_token=' + token)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.message != undefined) {
                    if(responseJson.message.indexOf('not allowed') >= 0) {
                    } else {
                        this.props.navigation.navigate('Products');
                    }
                } else
                    this.props.navigation.navigate('Products');
            });
        });
    }

    async SaveToken (key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            Alert.alert('Failed to authenticate user. Please try again later.');
        }
    }

    Authenticate = () => {
        let user = null;
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
                        isFormValid: true,
                        isLoading: false,
                        errorMessage: ''
                    });
                    // Save api token to asyncstorage
                    user = responseJson.message;
                    this.SaveToken('Token', responseJson.api_token);
                    this.SaveToken('JustLoggedIn', 'true');
                } else {
                    this.setState({
                        isFormValid: false,
                        isLoading: false,
                        errorMessage: 'Invalid email / password combination'
                    });
                }
            })
            .then(() => {
                this.SaveToken('User', JSON.stringify(user));
            })
            .then(() => {
                // Set Flag to indicate user just logged in
                this.props.navigation.navigate('List');
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
        if(this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        
        return(
            <View style={styles.FormContainer}>
                <Text style={{fontSize: 20, marginRight: 25, textAlign: 'center', marginBottom: 7, marginTop: '50%'}}>
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
                        this.refs.txtPassword.focus(); 
                    }}
                    value={this.state.email} />
                    
                <TextInput
                    ref='txtPassword'
                    placeholder='Password'
                    secureTextEntry={true}
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            password: value
                        })
                    }
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