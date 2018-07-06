import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage, LayoutAnimation,
} from 'react-native';




export default class LogOutScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Auth')
    }


    render() {
        return (
            <View>
            </View>
        );
    }
}

