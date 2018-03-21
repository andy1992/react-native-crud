import React, { Component } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

import styles from './../styles/Styles';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import baseUrl from './../constants/api';
import {
    isTokenValid,
    logout
} from './../helpers/auth';

class ProductAddPage extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            productName: '',
            description: '',
            quantity: 0,
            price: 0.00,
            errorMessage: '',
            isFormValid: true,
            apiResult: '',
            isLoading: false,
            token: ''
        }
    }

    validateToken = () => {
        isTokenValid().then((value) => {
            if(!value) {
                logout();
                this.props.navigation.navigate('Login');
            }
        });
    }

    componentDidMount() {
        this.validateToken();
        AsyncStorage.getItem('Token').then((apiToken) => {
            this.setState({
                token: apiToken
            });
        });
    }

    static navigationOptions = {
        title: 'Add New Products',
        headerLeft: null
    };

    AddProduct = () => {
        if(this.state.productName == null || this.state.productName.length == 0) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Product Name field is required' 
            });
        } else if(this.state.description == null || this.state.description.length == 0) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Description field is required' 
            });
        } else if(this.state.quantity == null || this.state.quantity.length == 0) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Quantity field is required' 
            });
        } else if(isNaN(this.state.quantity)) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Quantity field must be numeric' 
            });
        } else if(this.state.price == null || this.state.price.length == 0) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Price field is required' 
            });
        } else if(isNaN(this.state.price)) {
            this.setState({
                isFormValid: false,
                errorMessage: 'The Price field must be numeric' 
            });
        } else {
            this.setState({
                isFormValid: true,
                errorMessage: '',
                isLoading: true
            });

            fetch(baseUrl + '/products?api_token=' + this.state.token, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_name: this.state.productName,
                    description: this.state.description,
                    quantity: this.state.quantity,
                    price: this.state.price
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
                    this.ClearState();
                    Alert.alert('Add Product Success', 'Product has been saved successfully', [{
                        text: 'OK',
                        onPress: () => {
                            this.Back();
                        }
                    }],{
                        cancelable: false
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                    Alert.alert('Failed to save product');
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                });
                console.error(error);
            });
        }
    }

    Back = () => {
        this.ClearState();
        this.props.navigation.navigate('List', {
            from: 'ProductAddPage'
        });
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

    ClearState = () => {
        this.setState({
            productName: '',
            description: '',
            quantity: 0,
            price: 0.00,
            errorMessage: '',
            isFormValid: true,
            apiResult: ''
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isFocused && nextProps.isFocused) {
            // screen enter (refresh data, update ui ...)
            this.ClearState();
            this.validateToken();
        }
        if (this.props.isFocused && !nextProps.isFocused) {
            // screen exit
        }
    }

    shouldComponentUpdate(nextProps) {
        return true;
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
                <Text style={{fontSize: 20, marginRight: 25, textAlign: 'center', marginBottom: 7}}>
                </Text>

                <TextInput
                    placeholder='Input Product Name'
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            productName: value
                        })
                    }
                    onSubmitEditing={(event) => { 
                        this.refs.txtDescription.focus(); 
                    }}
                    value={this.state.productName} />
                    
                <TextInput
                    ref='txtDescription'
                    placeholder='Input Description'
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            description: value
                        })
                    }
                    onSubmitEditing={(event) => { 
                        this.refs.txtQuantity.focus(); 
                    }}
                    value={this.state.description} />
                    
                <TextInput
                    ref='txtQuantity'
                    placeholder='Input Quantity'
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            quantity: value
                        })
                    }
                    onSubmitEditing={(event) => { 
                        this.refs.txtPrice.focus(); 
                    }}
                    value={this.state.quantity != 0 ? this.state.quantity.toString() : ''} />
                    
                <TextInput
                    ref='txtPrice'
                    placeholder='Input Price (USD)'
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    onChangeText={
                        value => this.setState({
                            price: value
                        })
                    }
                    onSubmitEditing={(event) => { 
                        this.AddProduct();
                    }}
                    value={this.state.price != 0 ? this.state.price.toString() : ''} />

                {this.renderError()}

                <TouchableOpacity 
                    activeOpacity = { .4 } 
                    style={styles.TouchableOpacityStyle} 
                    onPress={this.AddProduct}>
                        <Text style={styles.TextStyle}> Save </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    activeOpacity = { .4 } 
                    style={styles.TouchableOpacityStyle} 
                    onPress={this.Back}>
                        <Text style={styles.TextStyle}> Back </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default withNavigationFocus(ProductAddPage)