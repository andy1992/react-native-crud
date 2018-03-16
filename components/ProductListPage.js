import React, { Component } from 'react';

import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Text,
    Alert,
    TextInput,
    SearchBox,
    AsyncStorage
} from 'react-native';

import {
    baseUrl
} from './../constants/api';
import styles from '../styles/Styles';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc'
import {
    isTokenValid
} from './../helpers/auth';

class ProductListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true,
            refreshing: false,
            loadMore: false,
            page: 0,
            pageSize: 10,
            keyword: '',
        };
    }

    componentDidMount() {
        this.LoadProducts();
    }    
    
    componentWillReceiveProps(nextProps) {
        if (!this.props.isFocused && nextProps.isFocused) {
            // screen enter (refresh data, update ui ...)
            this.Refresh();
        }
        if (this.props.isFocused && !nextProps.isFocused) {
            // screen exit
        }
    }

    shouldComponentUpdate(nextProps) {
        return true;
    }

    static navigationOptions = {
        title: 'All Products',
        headerLeft: null
    };

    LoadProducts = () => {
        AsyncStorage.getItem('Token').then((apiToken) => {
            if(apiToken != null && apiToken != undefined) {
                let tempPage = this.state.page + 1;
                let url =  'http://api.rotimonas.com/v1/products/paginate/'+ tempPage.toString() + '/' + this.state.pageSize.toString();
                if(this.state.keyword.length > 0) {
                    url = url + '?q=' + this.state.keyword;
                }
                if(url.indexOf('?') >= 0) {
                    url = url + '&api_token=' + apiToken
                } else {
                    url = url + '?api_token=' + apiToken;
                }

                return fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if(responseJson.length > 0) {
                            this.setState({
                                loading: false,
                                loadMore: false,
                                refreshing: false,
                                data: (this.state.page === 0) ? responseJson : [...this.state.data, ...responseJson],
                                page: (this.state.page === 0) ? 1 : (this.state.page + 1)
                            });
                        } else {
                            if(responseJson.message != undefined) {
                                // If the token had been expired
                                if(responseJson.message.indexOf('not allowed') >= 0) {
                                    // Sign the user out
                                    AsyncStorage.removeItem('User');
                                    AsyncStorage.removeItem('Token');

                                    // Navigate user to the sign in screen
                                    Alert.alert('Your session has expired. Please login first.');
                                    this.props.navigation.navigate('Login');
                                } else {
                                    this.setState({
                                        loading: false,
                                        loadMore: false,
                                        refreshing: false
                                    });
                                }
                            } else {
                                this.setState({
                                    loading: false,
                                    loadMore: false,
                                    refreshing: false
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                this.props.navigation.navigate('Login');
            }
        });
    }

    Refresh = () => {
        this.setState({
            page: 0,
            data: [],
            refreshing: true,
            keyword: ''
        }, () => {
            this.LoadProducts();
        });
    }

    LoadMore = () => {
        if (this.state.loading || this.state.loadMore) return null;

        if (this.state.data.length < this.state.pageSize) return null; // for very small dataset

        this.setState({
            loadMore: true
        }, () => {
            this.LoadProducts();
        });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    backgroundColor: "#CED0CE"
                }}
            />
        );
    }

    GetProductDetail = (productId, productName, description, quantity, price) => {
        this.props.navigation.navigate('ProductDetail', {
            productId: productId,
            productName: productName,
            description: description,
            quantity: quantity,
            price: price
        });
    }

    Search = () => {
        this.setState({
            loading: true,
            page: 0,
            data: []
        }, () => {
            this.LoadProducts();
        });
    }

    renderHeader = () => {
        if (!this.state.loading) return null;

        return (
            <View style={{ flex: 1, paddingTop: 20 }}>
                <ActivityIndicator />
            </View>
        );
    };

    render() {
        return (
            <View style={styles.BaseView}>
                <TextInput
                    placeholder='Search Product'
                    onSubmitEditing={() => this.Search()}
                    onChangeText={
                        value => this.setState({
                            keyword: value
                        })
                    }
                    value={this.state.keyword}
                    style={styles.SearchBox}
                />
                <View
                    style={{
                        height: 1,
                        backgroundColor: "#CED0CE"
                    }}
                />
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => (
                        <Text
                            style={ styles.RowContainer }
                            onPress={this.GetProductDetail.bind(
                                this,
                                item.product_id,
                                item.product_name,
                                item.description,
                                item.quantity,
                                item.price
                            )}
                        >
                            {item.product_name}
                        </Text>
                    )}
                    keyExtractor={item => item.product_id.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    onRefresh={this.Refresh}
                    refreshing={this.state.refreshing}
                    onEndReached={() => this.LoadMore()}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={() => {
                        if(this.state.loadMore) {
                            return <View style={{ flex: 1, paddingTop: 20 }}>
                                    <ActivityIndicator />
                                </View>
                        }
                        return null;
                    }}
                    onEndReachedThreshold='0.1'
                />
            </View>
        );
    }
}

export default withNavigationFocus(ProductListPage);