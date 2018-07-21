import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    ScrollView,
    NetInfo,
    FlatList,
    TouchableOpacity,
    ToastAndroid,
    UIManager,
    Button,
    ActivityIndicator,
    AsyncStorage, LayoutAnimation,
} from 'react-native';


import Icon from 'react-native-vector-icons/Entypo';
import ExpendableRow from './ExpendableRow.js';
import AppConstants from '../../constants/AppConstants.js';

import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import { apiMiddleware, reducer, getRepoDetail } from '../../redux/actions';
import {checkConnection, checkConnectionAsync, checkConnectionBeta, setReviewResult, setReviewStatus} from '../../lib/Networking';


// const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch movie data
// store.dispatch({type: 'GET_MOVIE_DATA'});


const Realm = require('realm');

import BackgroundTask from 'react-native-background-task';


// BackgroundTask.define(async () => {
//     // if (await checkConnectionAsync()) {
//     // NetInfo.isLoading.
//     NetInfo.isConnected.fetch().then(async isConnected => {
//         if (isConnected) {
//             let results = await AsyncStorage.getAllKeys();
//             // .then(results => {
//             let results2 = results.filter((key, value)=> key.includes('resultCheckList:'));
//             console.log(results2);
//             for (i=0;i<results2.length;i++) {
//                 let reviewId = results2[i].split(':')[1];
//                 let checkList = await AsyncStorage.getItem(results2[i]);
//                 // .then(checkList => {
//                 console.log('I am ee' + reviewId+ checkList);
//                 setReviewResult(reviewId, checkList);
//                 setReviewStatus(reviewId, "done");
//                 // });
//             }
//             // this.setState({
//             //     isLoading:false
//             // });
//             // this.getReviews();
//             ToastAndroid.show('Проверки отправлены', ToastAndroid.SHORT);
//             // });
//             await AsyncStorage.multiRemove(results2);
//             console.log('Hello from a background task');
//
//             BackgroundTask.finish();
//         }
//         else {
//             console.log('nothing happened');
//
//             BackgroundTask.finish();
//
//         }
//
//         // NetInfo.isConnected.removeEventListener(
//         //     'connectionChange',
//         //     this.sendReviews
//         // );
//         BackgroundTask.finish();
//
//
//         // console.log('First, is ' + (isConnected ? 'online' : 'offline'));
//     });
//
//     // }
//     // else {
//     //     console.log('Nothing happened');
//     // }
//
//
// });

// import sampleData from "../../constants/sampleData.json";
import CheckListItems from "./checkListItems";
import {
    ReviewSchema,
    CompanySchema,
    CarSchema,
    PersonSchema,
    realmSaveReviews,
    realmGetReviews
} from "../../store/realmStore";
import base64 from "../../lib/Base64";

// let BASE_URL = "http://10.0.2.2:8080";
// BASE_URL = "http://knd.itdhq.com";
//
// @connect(
//     state => ({
//         response: state.resp,
//         loading: state.loading,
//     }),
//     dispatch => ({
//         refresh: () => dispatch({type: 'GET_MOVIE_DATA'}),
//     }),
// )


class TableOneScreen extends React.Component {
    constructor(props) {
        super(props);
        if( Platform.OS === 'android' )
        {

            UIManager.setLayoutAnimationEnabledExperimental(true);

        }
        this.state = {
            borderColor: 'gray',
            borderWidth: 1,
            title       : props.title,
            expanded    : true,
            colors: ['#fff', '#eee'],
            isLoading: true,
            // responseAPI: [],
            textLayoutHeight: 0,
            updatedHeight: 0,
            expand: false,
            buttonText : 'Click Here To Expand'

        };
        // this.sendReviews = this.sendReviews.bind(this);
    }

    async getCheckLists(){
        console.log('here '+await checkConnectionAsync());

        let officerId = await AsyncStorage.getItem('userToken');
        let reviews = await AsyncStorage.getItem("Reviews");
        let plannedReviews = JSON.parse(reviews).filter(review => review.status=='scheduled');
        let completedReviews = JSON.parse(reviews).filter(review => review.status=='done');

        for (i=0;i<plannedReviews.length;i++){
            // console.log(plannedReviews[i].id);
            let reviewId = plannedReviews[i].id;
            fetch(AppConstants.BASE_URL +'/api/get/reviewDetails?reviewId='+reviewId)
                .then((response) => response.json())
                .then((responseJson) => {
                    AsyncStorage.setItem("CheckListItem:"+reviewId, JSON.stringify(responseJson.reviewType.checkListItems));
                })
                .catch((error) =>{
                    console.log(error);
                    console.log('wtf is this')

                });
        }

        for (i=0;i<completedReviews.length;i++){
            let reviewId = completedReviews[i].id;
            fetch(AppConstants.BASE_URL +'/api/get/reviewDetails?reviewId='+reviewId)
                .then((response) => response.json())
                .then((responseJson) => {
                    AsyncStorage.setItem("CheckListResult:"+reviewId, JSON.stringify(responseJson.reviewResults));
                })
                .catch((error) =>{
                    console.log(error);
                    console.log('wtf is this')
                });
        }
    };

    async getReviews() {
        console.log('dsfsd '+await checkConnectionAsync());
        let officerId = await  AsyncStorage.getItem('userToken');
        // console.log((BASE_URL))
        if (await checkConnectionAsync()) {
            return fetch(AppConstants.BASE_URL + '/api/get/reviewsByOfficer?officerId=' + officerId)
                .then((response) => response.json())
                .then((responseJson) => {
                    AsyncStorage.setItem("Reviews", JSON.stringify(responseJson.content));
                    let result = responseJson.content.filter(word => word.status == 'scheduled');
                    this.setState({
                        isLoading: false,
                        responseAPI: result,
                    },);
                    this.getCheckLists();
                    // realmSaveReviews(result, 'scheduled');
                    return result;
                })
                .catch(async (error) => {
                    console.log(error);
                    // let failResp = [];
                    // let failResp = await realmGetReviews('scheduled');
                    let failResp = await AsyncStorage.getItem("Reviews");
                    // console.log(failResp);
                    this.setState({
                        isLoading: false,
                        isOffline: true,
                        responseAPI: JSON.parse(failResp).filter(word => word.status == 'scheduled'),
                    },);
                    if (this.state.isOffline) {
                        ToastAndroid.show('Нет доступа к сети', ToastAndroid.SHORT);
                    }
                    // console.log("I AM HERE!@@@@!!!");
                });
        }
        else {
            let failResp = await AsyncStorage.getItem("Reviews");
            // console.log(failResp);
            this.setState({
                isLoading: false,
                isOffline: true,
                responseAPI: JSON.parse(failResp).filter(word => word.status == 'scheduled'),
            },);
            if (this.state.isOffline) {
                ToastAndroid.show('Нет доступа к сети', ToastAndroid.SHORT);
            }
        }

    }

    componentDidMount() {
        // BackgroundTask.schedule();
        // this.checkStatus();
        this.getReviews();
        // this.getCheckLists();
        // this.props.getRepoDetail('relferreira');
        // this._navListener1 = this.props.navigation.addListener('didBlur',
        //     payload => {
        //         this.setState({isLoading: true});
        //         // NetInfo.isConnected.removeEventListener(
        //         //     'connectionChange',
        //         //     this.sendReviews
        //         // );
        //     }
        // );
        // this._navListener2 = this.props.navigation.addListener('willFocus',
        //     payload => {
        //         this.getReviews();
        //         // NetInfo.isConnected.addEventListener(
        //         //     'connectionChange',
        //         //     this.sendReviews
        //         // );
        //     }
        // );

    }

    componentWillUnmount() {
        this.setState({isLoading: true});
        // this._navListener1.remove();
        // this._navListener2.remove();
        // this.netListener.remove();
    }

    async getData() {
        let data = [];
        let checkedKeys = await AsyncStorage.getAllKeys();
        let wtf = checkedKeys.filter((value) => value.indexOf('companyId:') > -1);

        for (let i = 0; i < wtf.length; i++) {
            let values = await AsyncStorage.getItem(wtf[i]);
            data.push(JSON.parse(values))
        }
        this.setState({
            responseAPI: data
        });

        if (data.length>0) {
            return data
        }
        else {
            console.log('WTF');
            return []
        }
    }

    _signInAsync = () => {
        this.props.navigation.navigate('Other', {
            // companyId: item.id,
            company: item.orgname,
            onGoBack: this,
            onNavigateBack: this.handleOnNavigateBack.bind(this)
        });
        return 0;
    };




    renderHeader = () => {
        return (
            <View>
                <View style={{flex: 1,
                    flexDirection: 'row',
                    // alignSelf: 'stretch',
                    minHeight: 30,

                    backgroundColor: '#fff',
                    // alignItems: 'center',
                    // height: "100%",
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity style={{flex: 1}}><Text style={{marginTop:3, flex: 1,fontWeight:"100", textAlign: 'center', fontSize: 16}}>Дата
                        <Icon name="select-arrows" size={15} onPress={() => null} />
                    </Text></TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}}><Text style={{marginTop:3,flex: 1,fontWeight:"400", textAlign: 'center', fontSize: 16}}>Организация
                        <Icon name="select-arrows" size={15} onPress={() => null} />
                    </Text></TouchableOpacity>

                    <TouchableOpacity style={{flex: 1}}><Text style={{marginTop:3,flex: 1,fontWeight:"300", textAlign: 'center', fontSize: 16}}>Адрес
                        <Icon name="select-arrows" size={15} onPress={() => null} />
                    </Text></TouchableOpacity>
                </View>
                <View style={{
                    height: 4,
                    // width: "86%",
                    backgroundColor: "#CED0CE",
                    // marginLeft: "14%"
                }}/>

            </View>);
    };


    handleOnNavigateBack = () => {
        this.getData();
        // console.log('test');
    };

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item, index}) => (
        <View>
            <View style={{backgroundColor: 'white', alignSelf: 'stretch',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'}}>
                <ExpendableRow address={item.company.address} type={item.name} date={item.date} orgname={item.company.orgname} />
                <View>
                    <TouchableOpacity>
                        <Icon name="chevron-small-right" size={35} onPress={() => {
                            // this.setState({isLoading:true});
                            this.props.navigation.navigate('Other', {
                            company: item.company.orgname,
                            companyId: item.company.id,
                            reviewId: item.id,
                            onGoBack: () => {this.getReviews(); ToastAndroid.show('Отчёт отправлен', ToastAndroid.SHORT);}
                        })
                        }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );


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


    render() {

        const { user, loadingProfile } = this.props;
        let emptyComponent = <View style={{flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            // height: 450,
            height:'100%',
            justifyContent: 'center',
            // flexDirection: 'column'
        }}>
            <Text style={{margin:50, textAlign:'center', justifyContent: 'center'}}>
            На данный момент запланированные проверки отсутствуют.
        </Text>
            <Button title={'Обновить'} onPress={() => {this.getReviews()}}/>
        </View>

        if (this.state.isOffline ) {
            let CustomComponent =  <View><Text>wtf</Text></View>
        }
        else {
            let CustomComponent = <View></View>
        }
        let CustomComponent = <View></View>

        function f() {
            Realm.open({schema: [CarSchema, PersonSchema]})
                .then(realm => {
                    // Create Realm objects and write to local storage
                    // Query Realm for all cars with a high mileage
                    const cars = realm.objects('Car').filtered('miles > 1000');
                    // Will return a Results object with our 1 car
                    console.log(cars.length);
                     // => 1
                    // Add another car
                    // Query results are updated in realtime
                    cars.length // => 2
                    // console.log(cars);

                })
                .catch(error => {
                    console.log(error);
                });
        }


        // console.log(this.state.responseAPI);
        // if (this.state.responseAPI.length>0)
        // if (!this.state.isLoading)
        if(this.state.isLoading){
                return(
                    <View style={{flex: 1, padding: 20}}>
                        <ActivityIndicator/>
                    </View>
                )
        }
        // console.log();


        if (this.state.responseAPI.length>0)
        {
            return (
                <View style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}>
                    <View>
                        <FlatList
                            // ListHeaderComponent={this.renderHeader()}
                            ItemSeparatorComponent={this.renderSeparator}
                            // ListEmptyComponent={emptyComponent}
                            // data={this.getReviews}
                            data={this.state.responseAPI}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            refreshing={false}
                            onRefresh={() => this.getReviews()}
                            // style={styles.listStyle}
                        />
                    </View>
                    <View style={{
                        height: 1.5,
                        alignSelf: 'stretch',
                        backgroundColor: "#CED0CE",
                    }}
                    />
                </View>
            );
        }
        else {return emptyComponent}
    }
}



const mapStateToProps = ({ type, resp}) => ({
    type,
    resp
});

const mapDispatchToProps = {
    getRepoDetail
};



// export  default connect(mapStateToProps, mapDispatchToProps)(TableOneScreen);
export  default (TableOneScreen);



const styles = StyleSheet.create({
    container: {
        flex:1
    },
    listStyle: {
        justifyContent: 'center'
    },
});