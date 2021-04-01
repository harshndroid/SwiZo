import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, StatusBar } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AsyncStorage from '@react-native-community/async-storage';
import { vw, vh } from 'react-native-expo-viewport-units';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {updateUserInfo} from '../actions/user';

class Profile extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            name: this.props.user.user_name,
            phone: this.props.user.user_phoneNumber,
            address: this.props.user.user_address
        }
    }
    
    update(){
        fetch('http://192.168.43.192:8080/edit_user_details/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.props.user.user_id,
                user_name: this.state.name,
                user_phoneNumber: Number(this.state.phone),
                user_address: this.state.address
            })
        })
        .then(()=>{
            this.props.updateUserInfo({name:this.state.name, phone:this.state.phone, address:this.state.address});
        })
        .catch(e=>console.log("account.js",e))
    }
    
    render() {
        let {user} = this.props;
        return (
            <View style={{backgroundColor:"white", flex:1, padding:20}}>
                <Text style={{fontFamily: "Montserrat-Medium"}}>Update Name</Text>
                <TextInput
                    style={{fontFamily: "Montserrat-SemiBold"}}
                    value={this.state.name}
                    underlineColorAndroid="grey"
                    onChangeText={(e)=>this.setState({name:e})}
                />
                <Text style={{fontFamily: "Montserrat-Medium"}}>Update Mobile Number</Text>
                <TextInput
                    style={{fontFamily: "Montserrat-SemiBold"}}
                    value={this.state.phone.toString()}
                    underlineColorAndroid="grey"
                    onChangeText={(e)=>this.setState({phone:e})}
                />
                <Text style={{fontFamily: "Montserrat-Medium"}}>Update Delivery Address</Text>
                <TextInput
                    style={{fontFamily: "Montserrat-SemiBold"}}
                    value={this.state.address}
                    underlineColorAndroid="grey"
                    onChangeText={(e)=>this.setState({address:e})}
                />
                <Ripple style={{backgroundColor:"white", borderColor:"#408ec2", borderRadius:2, marginTop:30,borderWidth:1, alignSelf:"center", paddingVertical:10, paddingHorizontal:15}} onPress={()=>this.update()}>
                    <Text style={{fontFamily: "Montserrat-SemiBold", color:"#408ec2"}}>Update</Text>
                </Ripple>
            </View>
        );
    }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        updateUserInfo: updateUserInfo
    }, dispatch)
}

function mapStateToProps(state){
    return{
        user: state.user
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(Profile);