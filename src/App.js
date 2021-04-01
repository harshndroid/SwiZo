/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {userAuthorized, saveUserKey, saveUserInfo} from './actions/user';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AsyncStorage from '@react-native-community/async-storage';

import Landing from './BeforeAuthScreens/Landing';
import Location from './BeforeAuthScreens/Location';
import RestaurantList from './AfterAuthScreens/RestaurantList';
import ItemList from './AfterAuthScreens/ItemList';
import Cart from './AfterAuthScreens/Cart';
import Profile from './AfterAuthScreens/Profile';
import History from './AfterAuthScreens/History';
import CustomDrawer from './components/CustomDrawer';

const App= (props)=> {
    
    const Stack = createStackNavigator();
    const Drawer = createDrawerNavigator();
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState("");
    const [userDetail, setUserDetail] = useState("");
    
    useEffect(()=>{
        async function checkUserAuthorization() {
            const value = await AsyncStorage.getItem('@user_key');
            if(value !== null) {
                setLoading(false);
                setKey(value);
                props.saveUserKey(value);
                props.userAuthorized(true);
            }
            else{
                setLoading(false);
            }
        }
        checkUserAuthorization();
    }, [key]);
    useEffect(()=>{
        },[])
    useEffect(()=>{
        fetch('http://192.168.43.192:8080/set_user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_phoneNumber: Number(key)
            })
        })
        .then(res => res.json())
        .then(data => props.saveUserInfo(data[0]))
        .catch(err => {
            console.log("app.js...",err);  
        });
    }, [key]);
    
    useEffect(()=>{
    },[])
    function Loading(){
        return(
            <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontFamily: "Montserrat-Bold",fontSize:40, color:"tomato"}}>SwiZo</Text>
            </View>
        );
    }
        
    function BeforeAuthNavigator(){
        return(
            <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
                <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
            </Stack.Navigator>
        )
    }
    
    function Home(){
        return(
            <Stack.Navigator initialRouteName={RestaurantList}>
                <Stack.Screen name="RestaurantList" component={RestaurantList} options={{ headerShown: false }} />
                <Stack.Screen name="ItemList" component={ItemList} options={{ headerShown: false }} />
                <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
                <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
            </Stack.Navigator>
        )
    }

    return(
        loading ? <Loading /> :
                <NavigationContainer>
                    {
                        !props.user.authorized? 
                            <Stack.Navigator screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="BeforeAuthNavigator" component={BeforeAuthNavigator} />
                            </Stack.Navigator>
                            :
                            <Drawer.Navigator 
                                drawerContentOptions = {{labelStyle:{fontFamily: "Montserrat-Medium"}, activeTintColor:"#408ec2", activeBackgroundColor:"transparent"}}
                                drawerContent={(props) => <CustomDrawer {...props} />}
                            >
                                <Drawer.Screen name="Home" component={Home} options={{title:"Home", drawerIcon:({focused})=><Icon2 name="home" size={20} color={focused? "#408ec2": "black"}></Icon2>}}/>
                                <Drawer.Screen name="Profile" component={Profile} options={{title:"My Profile",headerShown:true,headerTitleStyle:{fontFamily: "Montserrat-Medium"},headerTintColor:"white", headerStyle:{backgroundColor:"#408ec2"}, drawerIcon:({focused})=><Icon name="user" size={20} color={focused? "#408ec2": "black"}></Icon>}}/>
                            </Drawer.Navigator>
                    }
                </NavigationContainer>
        )
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        userAuthorized: userAuthorized,
        saveUserKey: saveUserKey,
        saveUserInfo: saveUserInfo
    }, dispatch)
}

function mapStateToProps(state){
    return{
        user: state.user
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(App);