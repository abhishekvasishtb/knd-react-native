import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Platform,
    AsyncStorage, LayoutAnimation,
} from 'react-native';
// import { List, ListItem} from 'react-native-elements';

import {
    StackNavigator,
    createStackNavigator,
    createDrawerNavigator,
    SafeAreaView
} from 'react-navigation';

import Ionicon from 'react-native-vector-icons/Ionicons';
import ExpendableRow from './ExpendableRow.js';
import plannedReviewsScreen from './plannedReviews.js';
// import Snackbar from 'react-native-snackbar';
import completedReviewsScreen from './completedReviews.js';
import sampleData from "../../constants/sampleData.json";
import CheckListItemScreen from "./checkListItems";
import CheckListResultScreen from "./checkListResults.js";
import LogOutScreen from "../login/logout.js";

let GLOBAL_TINT_COLOR = "black";

if( Platform.OS === 'android' ){
    GLOBAL_TINT_COLOR = "white";
}
else {
    GLOBAL_TINT_COLOR = "black";
}

const PlannedReviewStack = createStackNavigator({
        Home: {
            screen: plannedReviewsScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Запланированные проверки',
                headerTintColor: GLOBAL_TINT_COLOR,
                headerTitleStyle: {fontWeight:"100"},
                // headerTintStyle: {fontWeight:"100",fontSize: 16},
                headerStyle: {
                    backgroundColor: '#4b57ff'
                },
                headerLeft: (
                    <Ionicon style={{marginLeft:5}} color={GLOBAL_TINT_COLOR} name="md-menu" size={35} onPress={() => navigation.openDrawer()}/>
                ),
            })
        },

        Other: {
            screen: CheckListItemScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Форма',
                headerTintColor: GLOBAL_TINT_COLOR,
                headerTitleStyle: {fontWeight:"100"},
                // headerTintColor: "blue",
                headerStyle: {
                    backgroundColor: '#4b57ff'
                }
            })
        }
    }
    );


const CompletedReviewsStack = createStackNavigator({

    Results: {screen:completedReviewsScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Выполненные проверки',
            headerTintColor: GLOBAL_TINT_COLOR,
            headerTitleStyle: {fontWeight:"100"},
            // headerTintColor: "blue",
            headerStyle: {
                backgroundColor: '#4b57ff'
            },
            headerLeft: (
                    <Ionicon style={{marginLeft:5}} color={GLOBAL_TINT_COLOR} name="md-menu" size={35} onPress={() => navigation.openDrawer()}/>
),
        })
    },
    CheckLists: {screen:CheckListResultScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Отчёт',
            headerTintColor: GLOBAL_TINT_COLOR,
            headerTitleStyle: {fontWeight:"100"},
            // headerTintColor: "blue",
            headerStyle: {
                backgroundColor: '#4b57ff'
            }
        })
    }
});



const DrawerExample = createDrawerNavigator(
    {
        Inbox: {
            // path: '/',
            screen: PlannedReviewStack,
            navigationOptions: {
                title: 'Запланированные',
            }
        },
        Draft: {
            screen: CompletedReviewsStack,
            navigationOptions: {
                title: 'Выполненные',
            }
        },
        LogOut: {screen:LogOutScreen,
            navigationOptions: {
                title: 'Выход',
            }}

    },
    {

        // headerMode: 'none',
        initialRouteName: 'Inbox',
    }
);


export default DrawerExample;




const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // zIndex: 10,
        flexDirection: 'column',
        // boxShadow: '0 0 100px rgba(0,0,0,.08)',
        backgroundColor: 'white',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    loginview: {
        flex: 1,
        backgroundColor: '#fff',
        // margin: 50,
        padding:20,
        shadowColor: 'rgba(0,0,0,.08)',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    item: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        height: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textInput: {
        height: 40,
        margin: 5,
        padding: 10,
        borderWidth: 1.5,
        // borderColor: 'blue',
        borderRadius: 5,
    },
    button: {
        margin: 20,
        // marginTop: 60,
        padding: 10,
        // margin: 50,
    },
    devbutton: {
        margin: 20,
        // marginTop: 60,
        padding: 10,
        // color: 'black',
    },
    lastsep: {

        // flex:1,
        height: 1,
        width: "86%",
        backgroundColor: "red",
        // marginLeft: "14%"
    }
});