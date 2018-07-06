import React from 'react';
import { StyleSheet, Text, View, TextInput, Button,  Platform,
    ScrollView, StatusBar, FlatList, TouchableOpacity, Switch, AsyncStorage, ActivityIndicator, Alert, SectionList} from 'react-native';


import base64 from '../../lib/Base64.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Entypo';

import sampleData from "../../constants/sampleData.json";
import AppConstants from '../../constants/AppConstants.js';


class TestSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            switchValue: true
        };
    };

    // reviewId = this.props.navigation.getParam('reviewId', 'NO-ID');

    componentDidMount = () => {
        AsyncStorage.getItem('item:' + this.props.reviewId + ':' + this.props.checkListId).then((value) => {
            this.setState({switchValue: value == 'true'});
            // console.log('I am here, value is ' + value)
        }).done();
    };

    _handleToggleSwitch = (value) => {
        this.setState({
            switchValue: value
        });
        // console.log(this.props.company, this.props.companyId);
        AsyncStorage.setItem('item:' + this.props.reviewId + ':' + this.props.checkListId, value.toString());
        // console.log(this.props.company, this.props.checkListId);

    };


    render() {
        return (
            <Switch
                // thumbTintColor={"red"}
                tintColor={'#ed2939'}
                onTintColor={'green'}
                onValueChange={(value) => this._handleToggleSwitch(value, this.props.checkListId)}
                // onValueChange={(switchValue) => this.setState({switchValue})}
                value={this.state.switchValue}
            />
        );
    }
}


export default class CheckListItems extends React.Component {
    constructor(){
        super();
        this.state = {
            switchValue: false,
            isLoading: true
        };
    }

    getCheckList(){
        return fetch(AppConstants.BASE_URL +'/api/get/reviewDetails?reviewId='+this.props.navigation.getParam('reviewId', 'NO-ID'))
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    responseAPI: responseJson.reviewType.checkListItems,
                }, function(){

                });

            })
            .catch((error) =>{
                console.error(error);
            });
    }



    componentDidMount() {
        this.getCheckList()
    }



    setReviewResult(reviewId, checkList) {
        let username = 'admin';
        let password = 'admin';
        return fetch(AppConstants.BASE_URL+'/api/add/checkListResult?reviewId='+reviewId, {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + base64.btoa((username + ":" + password)),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkList),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    setReviewStatus(reviewId, status) {
        let username = 'admin';
        let password = 'admin';
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + base64(username + ":" + password));
        return fetch(AppConstants.BASE_URL+'/api/add/reviewResult?reviewId='+reviewId, {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + base64.btoa((username + ":" + password)),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: status
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    }


    // curl --user admin:admin -i -X POST -d '{"{checkListItemId_1}": "passed", "{checkListItemId_2}": "failed"}'
    // -H "Content-Type:application/json" http://localhost:8080/

    async sendCheckListAPI(item) {
        let value = {};
        let companyId = this.props.navigation.getParam('companyId', 'NO-ID');
        let company = this.props.navigation.getParam('company', 'NO-ID');
        let reviewId = this.props.navigation.getParam('reviewId', 'NO-ID');

        for (var i=0; i<this.state.responseAPI.length; i++) {
            let switchValue = await AsyncStorage.getItem('item:'+reviewId+':'+(i+1));
            // await AsyncStorage.removeItem('item:'+reviewId+':'+(i+1));
            switchValue =  switchValue=='true' ? "passed": 'failed';
            value[this.state.responseAPI[i].id] = switchValue;
        }

        this.setReviewResult(reviewId, value);
        this.setReviewStatus(reviewId, 'done');

        AsyncStorage.setItem('resultCheckList:'+companyId, value.toString());
        AsyncStorage.setItem('result:'+companyId, company);

        await AsyncStorage.removeItem('companyId:'+companyId);

        this.props.navigation.state.params.onGoBack();
        this.props.navigation.navigate('Home', {
            updateReviews: 3,
        });
        this.props.navigation.goBack()
    }

    _keyExtractor = (item, index) => item.id.toString();


    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    // width: "86%",
                    backgroundColor: "#CED0CE",
                    // marginLeft: "14%"
                }}
            />
        );
    };


    _renderItem = ({item}) => (
                <View style={styles.container}>
                    <View style={{width:"80%", margin: 15}}>
                       <Text style={{flex: 1, textAlign: 'left', fontSize: 16}}>{item.name}</Text>
                    </View>
                        <View style={{alignSelf: 'center'}}>
                        <TestSwitch
                            company={this.props.navigation.getParam('company', 'NO-ID')}
                            companyId={this.props.navigation.getParam('companyId', 'NO-ID')}
                            reviewId={this.props.navigation.getParam('reviewId', 'NO-ID')}
                            checkListId = {item.id}
                            checkListItem = {item.name}
                        />
                        </View>
                </View>
    );



    render() {

        if (this.state.isLoading) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }


        {
            return (
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View>
                        <FlatList
                            ItemSeparatorComponent={this.renderSeparator}
                            data={this.state.responseAPI}
                            // data={sampleData.checkList}
                            renderItem={this._renderItem}
                            // renderRow={({item}) => <Text>{item.orgname}</Text>}
                            keyExtractor={this._keyExtractor}
                            refreshing={false}
                            onRefresh={() => this.getCheckList()}
                        />
                    </View>
                    <View
                        style={{
                            height: 1,
                            // width: "86%",
                            backgroundColor: "#CED0CE",
                            // marginLeft: "14%"
                        }}
                    />
                    <View style={{margin: 50}}>
                        <Button onPress={value => this.sendCheckListAPI(value)} title="Отправить"/>
                    </View>
                </ScrollView>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // zIndex: 10,
        backgroundColor: 'white',
        alignSelf: 'stretch',
        flexDirection: 'row',
        // boxShadow: '0 0 100px rgba(0,0,0,.08)',
    },
    loginview: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 50,
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