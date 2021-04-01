import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import {Card} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-simple-toast';

import {connect} from 'react-redux';

class History extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.state = {
            
        }
    }
    
    render(){
        return (
            <>
                <StatusBar backgroundColor="black" />
                <View style={{backgroundColor:"#fff", flex:1}}>
                    <View style={{marginTop: 40}}/>
                    <View style={{flexDirection:"row",marginHorizontal: 15,alignItems:"center"}}>
                        <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>My Order History</Text>
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
        restaurant: state.restaurant
    };
}

export default connect(mapStateToProps, null)(History);