import React, { Component } from 'react';

import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import styles from './../styles/Styles';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

class ProductEditPage extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            productId: 0,
            productName: '',
            description: '',
            quantity: 0,
            price: 0.00,
            errorMessage: '',
            isFormValid: true,
            apiResult: ''
        }
    }

    static navigationOptions = {
        title: 'Edit Product',
        headerLeft: null
    };

    componentDidMount(){
        this.setState({
            productId: this.props.navigation.state.params.productId,
            productName: this.props.navigation.state.params.productName,
            description: this.props.navigation.state.params.description,
            quantity: this.props.navigation.state.params.quantity,
            price: this.props.navigation.state.params.price,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isFocused && nextProps.isFocused) {
            // screen enter (refresh data, update ui ...)
            this.setState({
                productId: this.props.navigation.state.params.productId,
                productName: this.props.navigation.state.params.productName,
                description: this.props.navigation.state.params.description,
                quantity: this.props.navigation.state.params.quantity,
                price: this.props.navigation.state.params.price,
            });
        }
        if (this.props.isFocused && !nextProps.isFocused) {
            // screen exit
        }
    }

    shouldComponentUpdate(nextProps) {
        return true;
    }

    Back = () => {
        this.props.navigation.navigate('ProductDetail', {
            productId: this.state.productId,
            productName: this.state.productName,
            description: this.state.description,
            quantity: this.state.quantity,
            price: this.state.price,
            isLoading: false
        });
    }

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

            fetch('http://api.rotimonas.com/v1/products/' + this.state.productId.toString(), {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: this.state.productId,
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
                    Alert.alert('Edit Product Success', 'Product has been saved successfully', [{
                        text: 'OK',
                        onPress: () => {
                            this.props.navigation.navigate('ProductList');
                        }
                    }],{
                        cancelable: false
                    });
                } else {
                    Alert.alert('Failed to save product');
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

    ClearState = () => {
        this.setState({
            productId: 0,
            productName: '',
            description: '',
            quantity: 0,
            price: 0.00,
            errorMessage: '',
            isFormValid: true,
            apiResult: ''
        });
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
                    Edit Product - {this.state.productName}
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

export default withNavigationFocus(ProductEditPage)