import React from 'react';
import {
    StyleSheet, Text, View, TextInput, Button, AsyncStorage,
    KeyboardAvoidingView, Keyboard, ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

// import sampleData from "../../constants/sampleData.json";
import base64 from "../../lib/Base64";
import AppConstants from '../../constants/AppConstants.js';


// let BASE_URL = "http://10.0.2.2:8080";

let inspectors = ['Инспектор 1', 'Инспектор 2'];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '',
            password: '',
            LoginBorderColor: 'gray',
            LoginBorderWidth: 1,
            authorized: false,
            PasswordBorderColor: 'gray',
            PasswordBorderWidth: 1};
    }

    static navigationOptions = {
        header: null
    };




    handleLoginInput = (text) => {
        this.setState({ LoginBorderColor: 'lightblue', LoginBorderWidth:2 })
    };

    handlePasswordInput = (text) => {
        this.setState({ PasswordBorderColor: 'lightblue', PasswordBorderWidth:2 })
    };

     async checkLogin(login, password) {
         try {
             let user = 'admin';
             let pass = 'admin';
             let response = await fetch(AppConstants.BASE_URL+'/api/login', {
                 method: 'POST',
                 headers: {
                     Authorization: 'Basic ' + base64.btoa((user + ":" + pass)),
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     name: login,
                     password: password
                 }),
             }).catch((err) => {return err});
             // console.log(response);
             if (response.status==200) {
                 console.log('I AM HERE!');
                 this.setState({
                     authorized: true
                 });
                 let responseJson = await response.json();
                 responseJson["status"]=200;
                 console.log(responseJson);
                 return responseJson;
             }
             else {
                 return response;
             }
             // let responseJson = await response.json();
         } catch (error) {
             console.error(error);
             let  response = {};
             response['status']=401;
             return response;

         }
     }
     
    _signInAsync = async () => {
        Keyboard.dismiss();
        let checkLogin = await this.checkLogin(this.state.login, this.state.password);
        // console.log('!!Status ' + checkwtf.status );
        // console.log('!!Status ' + checkwtf.officers[0].role);
        // if (checkwtf==200) {
        try
        {
            // if (this.state.password=='admin' && this.state.login=='admin') {
            if (checkLogin.status === 200 && checkLogin.officers[0].role === 'Inspector') {
                await AsyncStorage.setItem('userToken', "" + checkLogin.officers[0].id);
                this.props.navigation.navigate('App');
            }

            else {
                ToastAndroid.show('Что-то пошло не так', ToastAndroid.SHORT);
            }
        }
        catch (e) {
            ToastAndroid.show('Что-то пошло не так', ToastAndroid.SHORT);
        }
    };


    containerTouched(event) {
        this.refs.TextInputLogin.blur();
        this.refs.TextInputPassword.blur();
        return false;
    }

    render() {
        return (
            <KeyboardAvoidingView onStartShouldSetResponder={this.containerTouched.bind(this)}  keyboardShouldPersistTaps={false}
                                  ref='Login' style={styles.container} behavior="padding" enabled>
                <View elevation={6} style={styles.loginview}>
                    <Icon name="eye" color="#4F8EF7" size={40} style={styles.eye} />
                    <Text style={styles.title}>Демонстрационный стенд системы организации контроль-надзорной деятельности</Text>

                    <TextInput ref='TextInputLogin'
                               style={{height: 40,margin: 10,padding: 10,borderWidth: this.state.LoginBorderWidth,
                                   borderRadius: 5, borderColor:this.state.LoginBorderColor
                               }}
                               placeholder="Логин"
                               onChangeText={(login) => this.setState({login})}
                               underlineColorAndroid={'transparent'}
                               onFocus={this.handleLoginInput}
                               onSubmitEditing={(text) => {this.setState({borderColor:'gray'});
                                                             this.refs.TextInputPassword.focus();
                               }}
                               onBlur={() => this.setState({LoginBorderColor:'gray', LoginBorderWidth:1})}
                    />

                    <TextInput ref='TextInputPassword'
                               style={{height: 40,margin: 10,padding: 10,borderWidth: this.state.PasswordBorderWidth,
                                   borderRadius: 5, borderColor:this.state.PasswordBorderColor
                               }}
                               onFocus={this.handlePasswordInput}
                               underlineColorAndroid={'transparent'}
                               placeholder="Пароль"
                               onChangeText={(password) => this.setState({password})}
                               secureTextEntry={true}
                               onSubmitEditing={(text) => {this.setState({borderColor:'gray'});
                                                            this._signInAsync()
                               }}
                               onBlur={() => this.setState({PasswordBorderColor:'gray', PasswordBorderWidth: 1})}
                    />
                    <View style={{height: 40,margin: 10,padding: 0, marginBottom: 20}}>
                        <Button onPress={this._signInAsync}
                                title="Войти"/>
                    </View>
                </View>
            </KeyboardAvoidingView>

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
    loginview: {
        // flex: 1,
        backgroundColor: '#fff',
        margin: 50,
        padding:20,
        // height: "80%",
        // flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    eye: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
