import React from 'react';
import { View, Text, Alert } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/AntDesign';

import { DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-community/async-storage';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {userAuthorized} from '../actions/user';

const CustomDrawer = (props) => {
    async function logout(){
        props.userAuthorized(false);
        console.log("User Logged Out.");
        await AsyncStorage.removeItem('@user_key');
    }
  return (
    <DrawerContentScrollView {...props}>
        <View style={{height: 140, justifyContent:"flex-end",paddingHorizontal: 20,paddingBottom:20, backgroundColor:"#408ec2", position:"absolute", width:"100%"}}>
            <Text style={{fontSize: 18, color:"white", fontFamily: "Montserrat-SemiBold",}}>{props.user.user_name}</Text>
            <Text style={{fontSize: 15, color:"white", fontFamily: "Montserrat-Medium",paddingTop:5}}>{props.user.user_address}</Text>
            <Text style={{fontSize: 14, color:"white", fontFamily: "Montserrat-Regular",paddingTop:5}}>+91-{props.user.user_phoneNumber}</Text>
        </View>
        <View style={{marginTop: 140}}/>
        <DrawerItemList {...props}/>
        <DrawerItem
            label="My Order History"
            labelStyle={{fontFamily: "Montserrat-Medium", color:"grey"}}
            icon={()=><Icon2 name="history" size={20}></Icon2>}
            onPress={() => props.navigation.navigate("History")}
        />
        <DrawerItem
            label="Settings"
            labelStyle={{fontFamily: "Montserrat-Medium", color:"grey"}}
            icon={()=><Icon3 name="setting" size={20}></Icon3>}
            onPress={() => Alert.alert("This section is under development")}
        />
        <DrawerItem
            label="Logout"
            labelStyle={{fontFamily: "Montserrat-Medium", color:"grey"}}
            icon={()=><Icon3 name="logout" size={20}></Icon3>}
            onPress={logout}
        />
        <View style={{backgroundColor:"#ccc", height:0.2}}/>
    </DrawerContentScrollView>
    );
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        userAuthorized: userAuthorized
    }, dispatch)
}

function mapStateToProps(state){
    return{
        user: state.user
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(CustomDrawer);