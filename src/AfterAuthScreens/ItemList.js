import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, StyleSheet, StatusBar, Switch, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Card } from 'native-base';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Foundation';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { vw, vh } from 'react-native-expo-viewport-units';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {saveItems, saveCategories} from '../actions/menu';
import Veg from '../img/veg.svg';
import NonVeg from '../img/non-veg.svg';

class ItemList extends Component {
    constructor(props){
        super(props);
        this.navigation = props.navigation;
        this.restaurant_id = props.route.params.restaurant_id;
        this.state = {
            isVisible: false,
            cart: {},
            cartPrice: 0,
            catItems: [],
            catTitle: "",
            toggle: false,
            wishlist: []
        }
        this.c = {};
    }

    componentDidMount() {
        return this.getItems(this.restaurant_id)
        .then((data) => this.props.saveItems(data));
    }

    getItems = (r_id) => {
        return new Promise(function(resolve, reject) {
            fetch('http://192.168.43.192:8080/get_items/',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    restaurant_id: Number(r_id)
                })
            })
                .then(res => {
                    return res.json()
                })
                .then(data => resolve(data))
                .catch(e => {
                    reject(e.message);
                    console.log("items.js",e)
                });
            });
    }

    getCategories = () => {
        this.openModal();
        fetch('http://192.168.43.192:8080/get_categories/')
            .then(res => res.json())
            .then(data => {
                this.props.saveCategories(data);
            })
            .then(() => this.openModal())
            .catch(e => console.log("category fetch",e));
    }

    openModal(){
        this.setState({isVisible: true});
    }
    closeModal(){
        this.setState({isVisible: false});
    }

    addToCart(item_id){
        this.c[item_id] = 1;
        this.setState({cart: this.c});
        this.props.menu.itemList.map((obj) => {
            if(obj['item_id'] == item_id) {
                this.setState({cartPrice: this.state.cartPrice + obj.item_price});
            }
        });
    }
    add(item_id){
        this.c[item_id] += 1;
        this.setState({cart: this.c});
        this.props.menu.itemList.map((obj) => {
            if(obj['item_id'] == item_id) {
                this.setState({cartPrice: this.state.cartPrice + obj.item_price});
            }
        });
    }
    sub(item_id){
        this.c[item_id] -= 1;
        this.setState({cart: this.c});
        this.props.menu.itemList.map((obj) => {
            if(obj['item_id'] == item_id) {
                this.setState({cartPrice: this.state.cartPrice - obj.item_price});
            }
        });
    }

    displayByCategory(cat_id){
        if(cat_id !== ""){
            this.setState({ catItems: [] });
            this.closeModal();
            let {menu} = this.props;
            let found = menu.itemList.find(obj=>obj.category_id === cat_id);
            if(found === undefined){
                Toast.show(`No items in ${menu.categoryList.find(obj=>obj.category_id == cat_id).category_name}`);
            }
            else{
                menu.itemList.map((obj)=>{
                    if(obj['category_id'] == cat_id){
                        this.setState(prevState => ({
                            catItems: [...prevState.catItems, obj],
                        }));
                    }
                });
                const obj = menu.categoryList.find(obj => obj.category_id == cat_id);
                this.setState({catTitle: obj.category_name});
            }
        }
        else{
            this.setState({catItems: []});
            this.closeModal();
        }
    }
    handleWishlist(item_id){
        if(this.state.wishlist.find(ele=>ele==item_id)){
            let filteredArray = this.state.wishlist.filter(ele=>ele!=item_id);
            this.setState({wishlist: filteredArray});
        }
        else{
            this.setState(ps => ({wishlist: [ ...ps.wishlist, item_id ]}))
        }
    }
    render(){
        let {menu} = this.props;
        const ItemSkeleton = () => {
            return(
                [0,1,2].map((i)=><View key={i} style={{marginTop: 20, marginLeft: 15}}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={20} height={20} borderRadius={10} />
                        <SkeletonPlaceholder.Item>
                            <View style={{paddingVertical: 10}}><SkeletonPlaceholder.Item width={120} height={10} /></View>
                            <View><SkeletonPlaceholder.Item width={80} height={10} /></View>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                </View>)
            )
        }
        const CategorySkeleton = () => {
            return(
                [0,1,2,3,4,5].map((i)=><View key={i} style={{marginTop: 20}}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item>
                            <View><SkeletonPlaceholder.Item width={100} height={15} /></View>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                </View>)
            )
        }
        const RenderItems = (prop) => {
            let {item, i} = prop;
            return(
                <View style={{marginHorizontal:15}}>
                    <View style={{justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginTop: 20}}>
                        <View style={{flex:1}}>
                            {item.veg == 1 ?
                                <Veg height={20} width={20}/>
                                :
                                <NonVeg height={20} width={20}/>
                            }
                            <View style={{paddingVertical:10}}>
                                <Text style={{fontSize: 17, fontFamily: "Montserrat-SemiBold"}}>{item.item_name}</Text>
                            </View>
                            <View style={{flexDirection:"row", alignItems:"center", width:vw(75)}}>
                                <View style={{flex:1}}><Text style={{fontSize: 13, color:"grey", fontFamily: "Montserrat-Regular"}}>Rs. {item.item_price}</Text></View>
                                {/*
                                    this.state.wishlist.find(ele => ele == item.item_id) ?
                                    <View style={{flex:4}}><Icon3 onPress={()=>this.handleWishlist(item.item_id)} name="heart" size={20} color="#e34444"></Icon3></View>
                                    :
                                    <View style={{flex:4}}><Icon3 onPress={()=>this.handleWishlist(item.item_id)} name="heart" size={20} color="#ccc"></Icon3></View>
                                */}
                            </View>
                        </View>
                        <View>
                            {
                                this.state.cart[item.item_id] > 0 ?
                                    <View key={item.item_id} style={{marginRight: 15}}>
                                        <Card style={{elevation:2, backgroundColor:"white"}}>
                                            <View style={styles.add_sub_view}>
                                                <TouchableOpacity onPress={()=>this.sub(item.item_id)} style={{paddingRight: 20}}>
                                                    <Text style={styles.add_sub}>-</Text>
                                                </TouchableOpacity>
                                                <Text style={{color:"black", fontSize:15, fontFamily: "Montserrat-Medium"}}>{this.state.cart[item.item_id]}</Text>
                                                <TouchableOpacity onPress={()=>this.add(item.item_id)} style={{paddingLeft: 20}}>
                                                    <Text style={styles.add_sub}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Card>
                                    </View>
                                    :
                                    <Ripple rippleContainerBorderRadius={5} onPress={()=>this.addToCart(item.item_id)} style={styles.ripple}>
                                        <Text style={{color:"#72a31d", fontSize:13, fontFamily: "Montserrat-SemiBold"}}>ADD</Text>
                                    </Ripple>
                            }
                        </View>
                    </View>
                    <View style={{marginTop: 20, borderColor:"#ccc", borderWidth: 0.3}}/>
                </View>
            )
        }
        const DisplayCategoryItems = () => {
            let categoryVegItems = this.state.catItems.filter(item => item.veg == 1);
            return !this.state.toggle ?
            this.state.catItems.map((item, i)=>
                <View key={item.item_id}>
                    <RenderItems item={item} i={i} />
                    { i == this.state.catItems.length-1 ? <View style={{backgroundColor:"white",height: 80, width:vw(100) }}/> : null}
                </View>
            )
            :
            categoryVegItems.map((item, i)=>
                <View key={item.item_id}>
                    <RenderItems item={item} i={i} />
                    { i == categoryVegItems.length-1 ? <View style={{backgroundColor:"white",height: 80, width:vw(100) }}/> : null}
                </View>
            )
        }
        const DisplayAllItems = () => {
            let {menu} = this.props;
            let vegItems = menu.itemList.filter(item => item.veg == 1);
            return !this.state.toggle ?
            menu.itemList.map((item, i)=>
                <View key={item.item_id}>
                    <RenderItems item={item} i={i} />
                    { i == menu.itemList.length-1 ? <View style={{backgroundColor:"white",height: 80, width:vw(100) }}/> : null}
                </View>
            )
            :
            vegItems.map((item, i)=>
                <View key={item.item_id}>
                    <RenderItems item={item} i={i} />
                    { i == vegItems.length-1 ? <View style={{backgroundColor:"white",height: 80, width:vw(100) }}/> : null}
                </View>
            )

        }
        return (
            <>
                <StatusBar backgroundColor="black" />
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
                        {
                            Object.keys(menu).length === 2 ?
                            <>
                                <TouchableOpacity onPress={()=>this.displayByCategory("")}>
                                    <Text style={{color:"black",fontSize: 17,padding:5, fontFamily:"Montserrat-SemiBold"}}>Show All Items</Text>
                                </TouchableOpacity>
                                {
                                    menu.categoryList.map(item =>
                                        <TouchableOpacity onPress={()=>this.displayByCategory(item.category_id)} key={item.category_id}>
                                            <Text style={{color:"black",fontSize: 17,padding:5, fontFamily:"Montserrat-SemiBold"}}>{item.category_name}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </>
                            :
                            <CategorySkeleton />
                        }
                    </View>
                </Modal>

                <View style={{flex:1, backgroundColor: "#fff"}}>
                    <View style={{flexDirection:"row", marginTop: 40, marginHorizontal: 15, alignItems:"center", justifyContent:"space-between"}}>
                        <Text style={{fontSize: 14, color:"grey", fontFamily: "Montserrat-Regular"}}>Cart Amount: Rs. {this.state.cartPrice}</Text>
                        <TouchableOpacity onPress={()=>this.navigation.navigate("Home", {screen: 'Cart', params: {restaurant_id: this.restaurant_id, c: this.c, cartPrice: this.state.cartPrice}})}>
                            <Icon2 name='shopping-bag' color="tomato" size={20}></Icon2>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 10, borderColor:"grey", marginHorizontal: 15, borderWidth: 0.3}}/>
                    <View style={{flexDirection:"row", marginTop:10, marginBottom:20, justifyContent:"space-between", alignItems:"center"}}>

                        {
                            this.state.catItems.length !== 0 ?
                            <Text style={{marginLeft:15, fontFamily: "Montserrat-Medium"}}>{this.state.catTitle}</Text>
                            :
                            <Text style={{marginLeft:15, fontFamily: "Montserrat-Medium"}}>All Items</Text>
                        }

                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Text style={{fontSize:13, fontFamily: "Montserrat-Medium"}}>Veg Only</Text>
                            <Switch
                                trackColor={{ false: "#ccc", true: "#f5f5f5" }}
                                thumbColor={this.state.toggle ? "#62bd3e" : "#f4f3f4"}
                                onValueChange={(value) => this.setState({ toggle: value })}
                                value={this.state.toggle}
                            />
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            Object.keys(menu).length === 0 ? <ItemSkeleton/>
                            :
                            this.state.catItems.length !== 0 ?
                                <DisplayCategoryItems />
                                :
                                <DisplayAllItems />
                        }
                    </ScrollView>
                    <Ripple rippleContainerBorderRadius={40} onPress={()=>this.getCategories()} style={styles.categoryfloat}>
                        <Icon name='restaurant' color="white" size={20}></Icon>
                        <Text style={{color:"white", fontSize:15, fontFamily: "Montserrat-SemiBold"}}>  Categories</Text>
                    </Ripple>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    modal: {
        position: "absolute",
        alignSelf: "center",
        bottom: 80,
        height: vh(35),
        width: vw(55),
        alignItems:"center",
        justifyContent:"center",
        padding: 20,
        margin: 0,
        backgroundColor: "white",
        borderRadius: 10,
    },
    phone_input: {
        fontSize: 15,
        width:"100%",
        fontFamily: "Montserrat-SemiBold"
    },
    phone_component: {
        marginTop:20,
        paddingLeft:5,
        flexDirection: "row",
        borderColor: "tomato",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        height: 45
    },
    categoryfloat: {
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        elevation: 3,
        borderRadius: 40,
        backgroundColor: "#408ec2",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 12
    },
    add_sub: {
        color: "black",
        fontSize: 20,
        fontFamily: "Montserrat-SemiBold"
    },
    ripple: {
        backgroundColor: "white",
        elevation: 5,
        borderRadius:5,
        paddingHorizontal: 20,
        marginRight: 15,
        paddingVertical: 10
    },
    add_sub_view: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
});

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        saveItems: saveItems,
        saveCategories: saveCategories
    }, dispatch)
}

function mapStateToProps(state){
    return{
        menu: state.menu
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(ItemList);
