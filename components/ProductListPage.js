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

import styles from '../styles/Styles';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import baseUrl from './../constants/api';
import {
    isTokenValid,
    logout,
    getToken
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
            shouldRefresh: false
        };
    }

    static navigationOptions = {
        title: 'All Products',
        headerLeft: null
    };

    componentDidMount() {
        isTokenValid().then((value) => {
            console.log(value);
            if(!value) {
                logout();
                this.props.navigation.navigate('Login');
            } else {
                // Only run Load Products when screen is loaded first time (not coming from other screen)
                if(this.props.navigation.state.params == undefined || this.props.navigation.state.params == null) {
                    this.setState({
                        page: 0,
                        keyword: '',
                        data: [],
                        shouldRefresh: true
                    }, () => {
                        AsyncStorage.getItem('JustLoggedIn').then((value) => {
                            if(value != undefined && value != null) {
                                console.log('loadproducts in componentDidMount called, page: ' + this.state.page);
                                this.LoadProducts();
                            }
                        });
                    });
                } else {
                    console.log(this.props.navigation.state.params);
                }
            }
        });
    }    
    
    componentWillReceiveProps(nextProps) {
        if (!this.props.isFocused && nextProps.isFocused) {
            // screen enter (refresh data, update ui ...)
            isTokenValid().then((value) => {
                if(!value) {
                    logout();
                    this.props.navigation.navigate('Login');
                } else {
                    AsyncStorage.getItem('JustLoggedIn').then((value) => {
                        if(value == undefined || value == null) {
                            if(this.state.shouldRefresh || (this.props.navigation.state.params != undefined && this.props.navigation.state.params != null)) {
                                this.Refresh();   
                                console.log('refresh in componentWillReceiveProps called, page: ' + this.state.page);
                            }
                        } else {
                            AsyncStorage.removeItem('JustLoggedIn');
                            console.log('JustLoggedIn has been removed from AsyncStorage');
                        }
                            
                    });
                }
            });
        }
        if (this.props.isFocused && !nextProps.isFocused) {
            // screen exit
        }
    }

    shouldComponentUpdate(nextProps) {
        return true;
    }

    LoadProducts = () => {
        getToken().then((apiToken) => {
            if(apiToken != undefined && apiToken != null) {
                let tempPage = this.state.page + 1;
                let url =  baseUrl + '/products/paginate/'+ tempPage.toString() + '/' + this.state.pageSize.toString();
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
                                page: this.state.page + 1
                            });
                        } else {
                            this.setState({
                                loading: false,
                                loadMore: false,
                                refreshing: false
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                logout();
                this.props.navigation.navigate('Login');
            }
        });
    }

    Refresh = () => {
        this.setState({
            page: 0,
            data: [],
            refreshing: false,
            loading: true,
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
                    onEndReachedThreshold='0.3'
                />
            </View>
        );
    }
}

export default withNavigationFocus(ProductListPage);