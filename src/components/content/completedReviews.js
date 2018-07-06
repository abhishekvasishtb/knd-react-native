import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Platform,
    ScrollView,
    TouchableHighlight,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage, LayoutAnimation,
} from 'react-native';
// import { List, ListItem} from 'react-native-elements';

import Icon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ExpendableRow from './ExpendableRow.js';
// import ExpendableRow from './ExpendableRow.js';
import  AppConstants from '../../constants/AppConstants.js';

// import Snackbar from 'react-native-snackbar';



// let BASE_URL = "http://10.0.2.2:8080";


export default  class TableTwoScreen extends React.Component {
    constructor(props) {
        super(props);
        // results = this.getResults().then(res => {return res});

        this.state = {
            // responseAPI: [],
            checkedKeys: [],
            isLoading: true,
            values: [],
            // results: this.getResults().then(res => {return res})
        };
    }

    async  getReviews() {
        let officerId = await AsyncStorage.getItem('userToken');
        return fetch(AppConstants.BASE_URL+'/api/get/reviewsByOfficer?officerId='+officerId+'&size=-1')
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                const result = responseJson.content.filter(word => word.status =='done');
                this.setState({
                    isLoading: false,
                    responseAPI: result,
                }, function(){

                });
                return result;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount(){
        this.getReviews()
    }

    async getData(){
        return await AsyncStorage.getAllKeys();
    }

    async getResults() {
        let data =[];
        let checkedKeys = await AsyncStorage.getAllKeys();
        let wtf = checkedKeys.filter((value) => value.indexOf('result:')>-1 );

        for (let i=0; i<wtf.length; i++) {
            let values = await AsyncStorage.getItem(wtf[i]);
            data.push({"name":values, "id": wtf[i].replace('result:','')})
        }
        this.setState({
            responseAPI: data
        });
        return data
    }


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


    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (
        <View>

            <View style={{backgroundColor: 'white', alignSelf: 'stretch',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'}}>

                <View style={{flex: 1,
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    minHeight: 70,
                    // backgroundColor: this.state.colors[index % 2]
                }}
                >
                    <ExpendableRow address={item.company.address} type={item.name} date={item.date} orgname={item.company.orgname} />
                </View>
                <View>


                    <TouchableOpacity>
                        <Icon name="chevron-small-right" size={35} onPress={() => {this.props.navigation.navigate('CheckLists', {
                            // companyId: item.id,
                            company: item.company.orgname,
                            companyId: item.company.id,
                            reviewId: item.id,
                            onGoBack: () => this.getData()

                        })}} />
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

    render() {
        let emptyComponent = <View style={{flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            // height: 450,
            // height: '100%',
            // alignSelf: 'stretch',
            justifyContent: 'center',
            // flexDirection: 'column'
        }}>
            <Text style={{margin:50, textAlign:'center', justifyContent: 'center'}}>
                На данный момент выполненные проверки отсутствуют.
            </Text>
            <Button title={'Обновить'} onPress={() => {this.getReviews()}}/>
        </View>

        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }


        if (this.state.responseAPI.length>0)
        {
            return (
                <View style={{
                    flex: 1,
                    // zIndex: 10,
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    // boxShadow: '0 0 100px rgba(0,0,0,.08)',
                    backgroundColor: 'white',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}>
                    <View>
                        <FlatList
                            // ListHeaderComponent={this.renderHeader()}
                            ItemSeparatorComponent={this.renderSeparator}
                            data={this.state.responseAPI}
                            ListEmptyComponent={emptyComponent}
                            // data={[{'name':"sdg"}]}
                            renderItem={this._renderItem}
                            // renderRow={({item}) => <Text>{item.orgname}</Text>}
                            keyExtractor={this._keyExtractor}
                            refreshing={false}
                            onRefresh={() => this.getReviews()}
                        /></View>
                    <View style={{height: 1.5,alignSelf: 'stretch',backgroundColor: "#CED0CE",}}/>
                </View>
            );
        }
        else { return emptyComponent}

    }
}