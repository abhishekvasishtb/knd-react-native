import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';


function onPressLearnMore() {
    return 0;
}



export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '',
            password: '',
            borderColor: 'gray',
            borderWidth: 1};
    }

    handleEmail = (text) => {
        // if
        this.setState({ borderColor: 'blue', borderWidth:2 })

    };

    render() {
        return (
            <View ref='Login' style={styles.container}>
                <View style={styles.loginview}>
                    <Icon name="eye" color="#4F8EF7" size={32} style={styles.eye} />
                    <Text style={styles.title}>Демонстрационный стенд системы организации контроль-надзорной деятельности</Text>
                    <Text>Changes you make will automatically reload.</Text>
                    <Text>Shake your phone to open the developer menu.</Text>
                    <TextInput
                        style={{height: 40,margin: 5,padding: 10,borderWidth: this.state.borderWidth,
                            borderRadius: 5, borderColor:this.state.borderColor
                        }}
                        placeholder="Логин"
                        onChangeText={(login) => this.setState({login})}
                        // underlineColorAndroid={'transparent'}
                        onFocus={this.handleEmail}
                        // onSubmitEditing={(text) => this.setState({borderColor:'gray'})}
                        onBlur={() => this.setState({borderColor:'gray'})}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Пароль"
                        onChangeText={(password) => this.setState({password})}
                        // keyboardType={'visible-password'}
                        secureTextEntry={true}
                    />
                    <View>
                        <Button onPress={onPressLearnMore}
                                style={styles.button}
                                title="Войти"
                                color="blue"
                                accessibilityLabel="Learn more about this purple button"/>
                    </View>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginview: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 50,
        padding:20,
    },
    eye: {
        alignSelf: 'center',
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
    }
});
