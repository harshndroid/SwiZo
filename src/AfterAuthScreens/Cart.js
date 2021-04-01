import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import {Card} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import { vw, vh } from 'react-native-expo-viewport-units';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';

import {connect} from 'react-redux';

class Cart extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            cartItems: [],
            disableBtn: true
        }
        this.c = props.route.params.c;
        this.totalPrice = props.route.params.cartPrice;
        this.restaurant_id = props.route.params.restaurant_id;
        this.selected_restaurant = this.props.restaurant.find(obj=>obj.restaurant_id == this.restaurant_id);
    }
    
    componentDidMount(){
        if(Object.values(this.c).filter(v=>v>=1).length == 0){
            this.setState({disableBtn: true});
        }
        else{
            this.setState({disableBtn: false});
            let {menu} = this.props;
            Object.keys(this.c).map(item_id=>{
                menu.itemList.map((obj)=>{
                    if(obj['item_id'] == item_id){
                        if(this.c[item_id] !== 0){
                            this.setState(prevState => ({
                                cartItems: [...prevState.cartItems, obj]
                            }));
                        }
                    }
                })
            });
        }
    }
    
    placeOrder(){
        let order_title = [];
        let {user, restaurant, menu} = this.props;
        Object.keys(this.c).map(item_id=>{
            menu.itemList.map((obj)=>{
                if(obj['item_id'] == item_id){
                    if(this.c[item_id] !== 0){
                        let str = obj.item_name + "-" + this.c[item_id];
                        order_title.push(str);
                    }
                }
            })
        });
        
        let d =  new Date();
        let year = d.getFullYear().toString();
        let date = d.getDate().toString();
        let millisecond = d.getMilliseconds().toString();
        let res_name = this.selected_restaurant.restaurant_name.slice(0,3).toUpperCase();
        
        fetch('http://192.168.43.192:8080/place_order/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: res_name + year + date + millisecond,
                order_title: order_title,
                user_id: Number(user.user_id),
                restaurant_id: Number(this.restaurant_id),
            })
        })
        .catch(e=>console.log("place order.js",e));
        setTimeout(()=>{
            Toast.show("Order Placed Successfully");
            this.navigation.navigate("RestaurantList");
        },2000)
    }
    
    render(){
        let {user, menu} = this.props;
        const RenderCartItems = () => {
            return(
                <>
                    {
                        this.state.cartItems.map(item=>
                            <View key={item.item_id}>
                                {
                                    this.c[item.item_id] > 0 ?
                                        <View style={{flexDirection:"row", margin: 20,alignItems:"flex-end"}} key={item.item_id}>
                                            <View style={{flex:1.5}}>
                                                {item.veg == 1 ?
                                                    <Icon name='radio-button-checked' color="green" size={20}></Icon>
                                                    :
                                                    <Icon name='radio-button-checked' color="#ab1b1b" size={20}></Icon>
                                                }
                                                <Text style={{fontSize:15,marginTop:15, fontFamily: "Montserrat-Medium"}}>{item.item_name}</Text>
                                            </View>
                                            <View style={{flex:1,alignItems:"center"}}><Text style={styles.semiBoldHeaderTxt}>{this.c[item.item_id]}</Text></View>
                                            <View style={{flex:1}}><Text style={styles.semiBoldHeaderTxt}>Rs. {item.item_price*this.c[item.item_id]}</Text></View>
                                        </View>
                                        :
                                        null
                                }
                            </View>
                        )
                    }
                </>
            )
        }
        return (
            <>
                <StatusBar backgroundColor="black" />
                <View style={{backgroundColor:"#fff", flex:1}}>
                    <View style={{marginTop: 40}}/>
                    <View style={{flexDirection:"row",marginHorizontal: 15,alignItems:"center"}}>
                        <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>Cart Items - Go back to item list to edit cart items</Text>
                    </View>
                    <View style={{marginTop: 10}}/>
                    <View style={{borderColor:"grey",marginHorizontal: 15, borderWidth: 0.3}}/>
                    <View style={{marginTop: 10}}/>
                    
                    <ScrollView showsVerticalScrollIndicator={false} style={{margin: 15}}>
                        {Object.values(this.c).filter(v => v >= 1).length == 0 ? <><Text style={{fontSize: 14, padding:10, color:"black", fontFamily: "Montserrat-Regular", textAlign:"center"}}>No items in cart</Text>
                        <Ripple onPress={()=>this.navigation.navigate("RestaurantList")} style={{borderColor:"tomato",borderWidth:1,alignSelf:"center"}}>
                            <Text style={{fontSize: 14, padding:10, color:"tomato", fontFamily: "Montserrat-Regular", textAlign:"center"}}>Browse Restaurants</Text>
                        </Ripple>
                        </>
                         : <RenderCartItems />}
                        <Text style={{fontSize: 14, padding:10, color:"black", fontFamily: "Montserrat-Regular", textAlign:"center"}}>
                            Only Cash On Delivery is available
                        </Text>
                        <View style={{flexDirection:"row",marginTop:10,flexWrap:"wrap", justifyContent:"center", alignItems:"center"}}>
                            <Icon name='location-on' color="black" size={20}></Icon>
                            <Text style={{fontSize: 14, color:"black", fontFamily: "Montserrat-Regular", textAlign:"center"}}>{user.user_address}</Text>
                        </View>
                    </ScrollView>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1, alignItems:"center", padding:20,backgroundColor:"#f5f5f5"}}>
                            <Text style={styles.semiBoldHeaderTxt}>Rs. {this.totalPrice}</Text>
                        </View>
                        {this.state.disableBtn? 
                            <View style={{flex:1, alignItems:"center",padding:20, opacity:0.8, backgroundColor:"tomato"}}>
                                <Text style={[styles.semiBoldHeaderTxt,{color:"white"}]}>Place Order</Text>
                            </View>:
                            <Ripple rippleSize={750} onPress={()=>this.placeOrder()} style={{flex:1, alignItems:"center",padding:20, backgroundColor:"tomato"}}>
                                <Text style={[styles.semiBoldHeaderTxt,{color:"white"}]}>Place Order</Text>
                            </Ripple>
                        }
                    </View>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    semiBoldHeaderTxt: {
        fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
    }
});

function mapStateToProps(state){
    return{
        user: state.user,
        restaurant: state.restaurant,
        menu: state.menu
    };
}

export default connect(mapStateToProps, null)(Cart);