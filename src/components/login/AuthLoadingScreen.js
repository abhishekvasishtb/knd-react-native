import React from 'react';
import {StyleSheet, Text, View, TextInput, Button, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native';



import Icon from 'react-native-vector-icons/Entypo';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator,  DrawerItems, SafeAreaView} from 'react-navigation';
import sampleData from "../../constants/sampleData.json";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }


    _bootstrapAsync = async () =>  {
        const userToken = await AsyncStorage.getItem('userToken');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };

    render() {
        return (

                <View elevation={6} style={styles.container}>
                    <ActivityIndicator />
                    <StatusBar barStyle="default" />
                </View>


        );
    }
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        //   backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',

    },
});
