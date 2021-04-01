import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import { vw, vh } from 'react-native-expo-viewport-units';
// import Geocoder from 'react-native-geocoding';

class Location extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat: 51.5079145,
            lon: -0.0899163,
        }
    }
    
    render() {
        // Geocoder.init("AIzaSyD12NF_VL2lp66e4OsivreCi5YTpXg9b7U");
        // Geocoder.from(41.89, 12.49)
        // .then(json => {
        //     var addressComponent = json.results[0].address_components[0];
        //     console.log(addressComponent);
        // })
        // .catch(error => console.warn(error));
        
        return (
            <>
                <MapView
                    style={{flex: 5}}
                    provider="google"
                    initialRegion={{
                        latitude: this.state.lat,
                        longitude: this.state.lon,
                        latitudeDelta: 0.0922 ,
                        longitudeDelta: 0.0421
                    }}
                    region={{
                        latitude: this.state.lat,
                        longitude: this.state.lon,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                    onPress	= {(e)=>this.setState({
                        lat: e.nativeEvent.coordinate.latitude,
                        lon: e.nativeEvent.coordinate.longitude
                    })}
                >
                    <Marker
                        draggable
                        coordinate={{latitude: this.state.lat, longitude: this.state.lon}}
                        // onDragEnd={e =>
                        //     this.setState({
                        //         latitude: e.nativeEvent.coordinate.latitude,
                        //         longitude: e.nativeEvent.coordinate.longitude
                        //     })
                        // }
                    />
                </MapView>
                <Ripple onPress={()=>{
                    Geolocation.getCurrentPosition(info => {
                        this.setState({lat: info.coords.latitude, lon: info.coords.longitude});
                    })
                }}
                    style={styles.iconView}
                >
                    <Icon name='gps-fixed' size={24} />
                </Ripple>
                <View style={{flex: 1, padding: 20, backgroundColor: "white"}}>
                    <Ripple style={{backgroundColor: "tomato", alignItems: "center", justifyContent: "center", padding: 10, elevation: 2}} onPress={()=>console.log("ok")}>
                        <Text style={{color: "white", fontSize: 15, fontFamily: "Montserrat-SemiBold"}}>CONFIRM LOCATION</Text>
                    </Ripple>
                </View>
            </>
        );
    }
};
const styles = StyleSheet.create({
    iconView: {
        padding: 5,
        elevation: 10,
        backgroundColor: "white",
        position: "absolute",
        bottom: vh(25),
        right: 20
    }
});

export default Location;