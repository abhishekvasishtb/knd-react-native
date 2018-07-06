import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ToastAndroid,
    UIManager,
    Button,
    ActivityIndicator,
    AsyncStorage, LayoutAnimation,
} from 'react-native';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ExpendableRow from './ExpendableRow.js';
import AppConstants from '../../constants/AppConstants.js';

// import Snackbar from 'react-native-snackbar';

// import sampleData from "../../constants/sampleData.json";
import CheckListItems from "./checkListItems";

// let BASE_URL = "http://10.0.2.2:8080";
// BASE_URL = "http://knd.itdhq.com";


export  default  class TableOneScreen extends React.Component {
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
    }



    async getReviews() {
        let officerId = await  AsyncStorage.getItem('userToken');
        // console.log((BASE_URL))
        return fetch(AppConstants.BASE_URL+'/api/get/reviewsByOfficer?officerId='+officerId)
            .then((response) => response.json())
            .then((responseJson) => {
                const result = responseJson.content.filter(word => word.status != 'done');
                this.setState({
                    isLoading: false,
                    responseAPI: result,
                },);

                    return result;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount(){
        this.getReviews();
        this._navListener1 = this.props.navigation.addListener('didBlur',
            payload => {
                this.setState({isLoading:true});
            }
        );
        this._navListener2 = this.props.navigation.addListener('willFocus',
            payload => {
                this.getReviews();
            }
        );
    }


    componentWillUnmount(){
        this.setState({isLoading:true});
        this._navListener1.remove();
        this._navListener2.remove();

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
        else { return emptyComponent}
    }
}




const styles = StyleSheet.create({
    container: {
        flex:1
    },
    listStyle: {
        justifyContent: 'center'
    },
});