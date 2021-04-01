import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, StatusBar, BackHandler } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { vw, vh } from 'react-native-expo-viewport-units';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {saveRestaurantDetail} from '../actions/restaurant';

class RestaurantList extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            search: ""
        }
    }
    
    componentDidMount() {
        return this.getRestaurantDetails()
        .then((data) => this.props.saveRestaurantDetail(data));
    }
    
    getRestaurantDetails = () => {
        return new Promise(function(resolve, reject) {
            fetch("http://192.168.43.192:8080/get_restaurants/")
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err.message); 
                    console.log("RestaurantList.js",err)
                })
        })
    }
    
    render() {
        let {user, restaurant} = this.props;
        const Skeleton = () => {
            return(
                <View style={{marginVertical: 20}}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item flexDirection="row">
                            <SkeletonPlaceholder.Item width={80} height={90} borderRadius={5} />
                            <SkeletonPlaceholder.Item marginLeft={10}>
                                <View style={{flex:1, justifyContent:"flex-start"}}><SkeletonPlaceholder.Item width={140} height={10} /></View>
                                <View style={{flex:1, justifyContent:"center"}}><SkeletonPlaceholder.Item width={100} height={10} /></View>
                                <View style={{flex:1, justifyContent:"flex-end"}}><SkeletonPlaceholder.Item width={80} height={10} /></View>
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                </View>
            )
        }
        return (
            <>
                <StatusBar backgroundColor="black" />
                <View style={{flex:1, backgroundColor: "#fff",padding:10}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Ripple onPress={()=>this.navigation.openDrawer()}><Icon name="menu" size={22}></Icon></Ripple>
                        <View style={styles.phone_component}>
                            <Icon name='search' color="grey" size={20}/>
                            <TextInput
                                style={styles.phone_input}
                                placeholder='Search restaurants...'
                                placeholderTextColor='grey'
                                keyboardType="phone-pad"
                                value={this.state.search}
                                onChangeText={search => this.setState({search: search})}
                            />
                        </View>
                    </View>
                    <View style={{marginTop: 40}}/>
                    {
                        Object.keys(restaurant).length === 0 ? <><Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>All Restaurants</Text><Skeleton/></>
                        :
                        this.state.search.length > 0 ?
                        <>
                            <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>Search Results</Text>
                            {
                                restaurant.find(res=>res.restaurant_name[0] == this.state.search[0].toUpperCase()) ?  
                                    <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>Restaurants Found</Text>
                                    : <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>No restaurants found</Text>
                            }
                        </>
                        :
                        <>
                            <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>All Restaurants</Text>
                            {restaurant.map(item=>
                                <Ripple key={item.restaurant_id} style={{marginVertical:20}} onPress={()=>this.navigation.navigate('Home', { screen: 'ItemList', params: {restaurant_id: item.restaurant_id}})}>
                                    <View style={{flexDirection:"row", backgroundColor:"#fff"}}>
                                        {
                                            item.restaurant_id == 201 ? <View><Image source={require('../img/dosa_img.jpg')} style={{height:90, width:80, borderRadius:5}}/></View>:
                                            item.restaurant_id == 202 ? <View><Image source={require('../img/paneer.jpg')} style={{height:90, width:80, borderRadius:5}}/></View>:
                                            item.restaurant_id == 203 ? <View><Image source={require('../img/ice_cream.jpg')} style={{height:90, width:80, borderRadius:5}}/></View>:
                                            <View><Image source={require('../img/pizza_img.jpg')} style={{height:90, width:80, borderRadius:5}}/></View>
                                        }   
                                        <View style={{marginLeft: 10}}>
                                            <View style={{flex:1, justifyContent:"flex-start"}}><Text style={{fontSize: 17, fontFamily: "Montserrat-SemiBold"}}>{item.restaurant_name}</Text></View>
                                            <View style={{flex:1, justifyContent:"center"}}><Text style={{fontSize: 14,color:"grey", fontFamily: "Montserrat-Regular"}}>{item.restaurant_description}</Text></View>
                                            <View style={{flex:1, justifyContent:"flex-end"}}><Text style={{fontSize: 13, color:"grey", fontFamily: "Montserrat-SemiBold"}}>Delivery Time: {item.restaurant_deliveryTime} mins.</Text></View>
                                        </View>
                                    </View>
                                </Ripple>
                            )}
                        </>
                    }
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    phone_input: {
        fontSize: 15,
        width:"80%",
        fontFamily: "Montserrat-SemiBold",
    },
    phone_component: {
        marginLeft:20,
        flexDirection: "row",
        borderColor: "tomato",
        borderBottomWidth: 0.5,
        alignItems: "center",
        height: 45,
    },
});

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        saveRestaurantDetail: saveRestaurantDetail
    }, dispatch)
}

function mapStateToProps(state){
    return{
        user: state.user,
        restaurant: state.restaurant
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(RestaurantList);