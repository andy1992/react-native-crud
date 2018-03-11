import React, { Component } from 'react';

import {
    View,
    TextInput,
    Text,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import styles from './../styles/Styles';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

class ProductDetailPage extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            productId: '',
            productName: '',
            description: '',
            quantity: 0,
            price: 0.00,
            isLoading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isFocused && nextProps.isFocused) {
            // screen enter (refresh data, update ui ...)
            this.PopulateFields();
        }
        if (this.props.isFocused && !nextProps.isFocused) {
            // screen exit
        }
    }

    shouldComponentUpdate(nextProps) {
        return true;
    }

    componentDidMount(){
        this.PopulateFields();
    }

    PopulateFields = () => {
        this.setState({
            productId: this.props.navigation.state.params.productId,
            productName: this.props.navigation.state.params.productName,
            description: this.props.navigation.state.params.description,
            quantity: this.props.navigation.state.params.quantity,
            price: this.props.navigation.state.params.price,
        });
    }

    static navigationOptions = {
        title: 'Product Detail',
        headerLeft: null
    }

    GoToEdit = () => {
        this.props.navigation.navigate('ProductEdit', {
            productId: this.state.productId,
            productName: this.state.productName,
            description: this.state.description,
            quantity: this.state.quantity,
            price: this.state.price
        });
    }

    Delete = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this product?',
            [
                {
                    text: 'Yes', onPress: () => {
                        this.setState({
                            isLoading: true
                        });
                        fetch('http://api.rotimonas.com/v1/products/' + this.state.productId.toString(), {
                            method: 'Delete',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
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
                                Alert.alert('Delete Product Success', 'Product has been deleted successfully', [{
                                    text: 'OK',
                                    onPress: () => {
                                        this.Back();
                                    }
                                }],{
                                    cancelable: false
                                });
                            } else {
                                Alert.alert('Failed to delete product');
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    }
                },
                {text: 'No', onPress: () => {}, style: 'cancel'}
            ],
            { cancelable: false }
        )
    }

    Back = () => {
        this.props.navigation.navigate('ProductList');
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
                <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 7}}>
                    Product Details    
                </Text>

                <TextInput
                    value={this.state.productName}
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    enabled='false' />
                    
                <TextInput
                    value={this.state.description}
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    enabled='false' />
                    
                <TextInput
                    value={this.state.quantity + ' unit(s)'}
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    enabled='false' />
                    
                <TextInput
                    value={'USD ' + this.state.price}
                    style={styles.TextInputStyleClass}
                    underlineColorAndroid='transparent'
                    enabled='false' />

                <TouchableOpacity 
                    activeOpacity = { .4 } 
                    style={styles.TouchableOpacityStyle} 
                    onPress={this.GoToEdit}>
                        <Text style={styles.TextStyle}> Edit </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    activeOpacity = { .4 } 
                    style={styles.TouchableOpacityStyle} 
                    onPress={this.Delete}>
                        <Text style={styles.TextStyle}> Delete </Text>
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

export default withNavigationFocus(ProductDetailPage)