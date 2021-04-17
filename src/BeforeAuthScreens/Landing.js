import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { vw, vh } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { saveUserInfo, userAuthorized } from '../actions/user';

const CarouselItems = [
    {
        title: 'Food delivered at your doorstep',
        uri: require('../img/bike_anim.gif'),
    },
    {
        title: 'Order food from your mobile app',
        uri: require('../img/pizza.png'),
    },
    {
        title: 'Order from plenty of restaurants',
        uri: require('../img/map_point.gif'),
    }
];

class Landing extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            activeDot: 0,
            isVisible: false,
            phone: "",
            address: "",
        }
    }

    saveUser = () => {
        fetch('http://192.168.43.192:8080/login/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_name: "",
                user_phoneNumber: Number(this.state.phone),
                user_address: this.state.address,
            })
        })
        .then(res=>res.json())
        .then(data=>{
            this.props.saveUserInfo(data[0]);
            // this.closeModal();
            this.storeData(this.state.phone);
            this.props.userAuthorized(true);
        })
        .catch(e=>console.log("landing.js",e))
    }

    storeData = async (value) => {
      try {
        await AsyncStorage.setItem('@user_key', value);
      } catch (e) {
          console.log(e);
      }
    }

    get pagination () {
          const { activeDot } = this.state;
          return (
              <View style={{alignItems: "center"}}>
                  <Pagination
                    dotsLength = {CarouselItems.length}
                    activeDotIndex = {activeDot}
                    dotStyle = {{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 5,
                        backgroundColor: "tomato"
                    }}
                    inactiveDotStyle = {{backgroundColor: "grey"}}
                    inactiveDotOpacity = {0.4}
                    inactiveDotScale = {0.6}
                  />
              </View>
          );
      }

    _renderItem({item,index}){
        return(
            <View key={index} style={{alignItems:"center"}}>
                <Image style={styles.carousel_image} source={item.uri}/>
                <View style={styles.carousel_title_container}>
                    <Text style={styles.carousel_title}>{item.title}</Text>
                </View>
            </View>
        )
    }
    openModal(){
        this.setState({isVisible: true});
    }
    closeModal(){
        this.setState({isVisible: false});
    }
    render(){
        return (
            <>
                <StatusBar backgroundColor="black" />
                <View style={{flex:1, backgroundColor: "#fff"}}>
                    <Modal
                        style={styles.modal}
                        isVisible={this.state.isVisible}
                        backdropOpacity={0.5}
                        animationIn="slideInUp"
                        onBackdropPress={()=>this.closeModal()}
                        useNativeDriver
                        onBackButtonPress={()=>this.closeModal()}
                    >
                    <View>
                        <Text style={{color:"black",fontSize: 17, fontFamily:"Montserrat-SemiBold"}}>LOGIN</Text>
                        <View style={styles.phone_component}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{fontFamily: "Montserrat-SemiBold", fontSize: 15}}>{"  "}+91</Text>
                            </View>
                            <View style={{ borderColor: "tomato", borderWidth: 0.4, height: 25, marginHorizontal: 15 }} />
                            <TextInput
                                style={styles.phone_input}
                                placeholder='Enter mobile number'
                                placeholderTextColor='grey'
                                keyboardType="phone-pad"
                                value={this.state.phone}
                                onChangeText={phone => this.setState({phone: phone})}
                                maxLength = {10}
                            />
                        </View>
                        <View style={styles.phone_component}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="location-on" size={24} style={{paddingLeft:10}}></Icon>
                            </View>
                            <View style={{ borderColor: "tomato", borderWidth: 0.4, height: 25, marginHorizontal: 15 }} />
                            <TextInput
                                style={styles.phone_input}
                                placeholder='Enter delivery address'
                                placeholderTextColor='grey'
                                value={this.state.address}
                                onChangeText={address => this.setState({address: address})}
                                maxLength = {50}
                            />
                        </View>
                        <View style={{marginTop:20}}>
                            {this.state.phone.length < 10 ?
                                <View style={{backgroundColor: "tomato", opacity:0.7, alignItems:"center", justifyContent:"center", padding: 10, elevation: 2}}>
                                    <Text style={{color:"white",fontSize:15, fontFamily: "Montserrat-SemiBold"}}>CONTINUE</Text>
                                </View>
                                :
                                <Ripple style={{backgroundColor: "tomato", alignItems:"center", justifyContent:"center", padding: 10, elevation: 2}} onPress={()=>this.saveUser()}>
                                    <Text style={{color:"white",fontSize:15, fontFamily: "Montserrat-SemiBold"}}>CONTINUE</Text>
                                </Ripple>
                            }
                        </View>
                    </View>
                  </Modal>
                  <View style={{flex:1}}>
                      <View style={{alignItems: "center", flex:3, paddingTop: 20}}>
                          <Carousel
                              ref={ref => this.carousel = ref}
                              sliderWidth = {vw(100)}
                              itemWidth = {vw(100)}
                              autoplay = {true}
                              autoplayInterval = {5000}
                              loop = {true}
                              data = {CarouselItems}
                              renderItem = {this._renderItem}
                              onSnapToItem = {(index) => this.setState({ activeDot: index }) }
                          />
                      </View>
                      <View style={{alignSelf: "center", flex:1, alignItems:"center"}}>
                          {this.pagination}
                          <Ripple style={{backgroundColor: "tomato", alignItems:"center", justifyContent:"center", padding: 15, elevation: 2}} onPress={()=>this.navigation.navigate("Location")}>
                              <Text style={{color:"white",fontSize:15, fontFamily: "Montserrat-SemiBold"}}>SET DELIVERY LOCATION</Text>
                          </Ripple>
                          <Text>{this.state.data}</Text>
                          <View style={{flexDirection:"row", alignSelf:"center", position:"absolute", bottom:5}}>
                              <Text style={{color:"gray", fontFamily: "Montserrat-SemiBold"}}>Have an account? </Text>
                              <TouchableOpacity activeOpacity={0.5} onPress={()=>this.openModal()}><Text style={{color:"tomato", fontFamily: "Montserrat-SemiBold"}}>Login</Text></TouchableOpacity>
                          </View>
                      </View>
                  </View>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
	carousel_image: {
        borderRadius: 0,
        height: vw(100),
        width: vw(100),
        resizeMode: 'contain'
    },
    carousel_title_container: {
        alignItems:"center",
        width: vw(80),
        paddingTop:30
    },
    carousel_title: {
        color: "black",
        fontSize: 25,
        textAlign:"center",
        fontFamily: "Montserrat-Bold"
    },
    modal: {
        position: "absolute",
        bottom: 0,
        height: vh(35),
        justifyContent: "flex-start",
        padding: 20,
        margin: 0,
        width: vw(100),
        backgroundColor: "white"
    },
    phone_input: {
        fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
        width: "60%"
    },
    phone_component: {
        marginTop:20,
        flexDirection: "row",
        borderColor: "tomato",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        // width: vw(100),
        height: 45,
    },
});

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        saveUserInfo: saveUserInfo,
        userAuthorized: userAuthorized
    }, dispatch)
}

export default connect(null, matchDispatchToProps)(Landing);
