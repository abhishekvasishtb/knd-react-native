import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Switch,
    ActivityIndicator,
    AsyncStorage, LayoutAnimation, ToastAndroid,
} from 'react-native';
// import { List, ListItem} from 'react-native-elements';
import sampleData from "../../constants/sampleData.json";
import AppConstants from '../../constants/AppConstants.js';


// let BASE_URL = "http://10.0.2.2:8080";

export  default  class CheckListScreen extends React.Component {

    constructor(props) {
        super(props);
        // results = this.getResults().then(res => {return res});
        this.state = {
            checkedKeys: [],
            values: [],
            isLoading: true
            // results: this.getResults().then(res => {return res})
        };
    }


    getCheckListResults2(){
        return fetch(AppConstants.BASE_URL +'/api/get/reviewDetails?reviewId='+this.props.navigation.getParam('reviewId', 'NO-ID'))
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson.reviewResults);
                this.setState({
                    isLoading: false,
                    responseAPI: responseJson.reviewResults,
                }, function(){

                });
                return responseJson.reviewResults;

            })
            .catch(async (error) =>{
                console.log(error);
                let checkList = await AsyncStorage.getItem("CheckListResult:"+this.props.navigation.getParam('reviewId', 'NO-ID'));
                console.log(checkList);
                this.setState({
                    isLoading: false,
                    responseAPI: JSON.parse(checkList),
                    isOffline: true
                });
                if (this.state.isOffline) {
                    ToastAndroid.show('Нет доступа к сети', ToastAndroid.SHORT);
                }
                return checkList;

            });
    }

    getCheckListResults(){
        AsyncStorage.getItem("CheckListResult:" + this.props.navigation.getParam('reviewId', 'NO-ID'))
            .then(checkList => {
                console.log(checkList);
                this.setState({
                    isLoading: false,
                    responseAPI: JSON.parse(checkList),
                    // isOffline: true
                });
            });
    }


    componentDidMount() {
        this.getCheckListResults();
    }

    getSwitch(val) {
        return val=='passed' ? true : false
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({item}) => (

        <View style={{flex: 1,
            // zIndex: 10,
            backgroundColor: 'white',
            alignSelf: 'stretch',
            flexDirection: 'row',
        }}>
            <View style={{width:"80%", margin: 15}}>
                <Text style={{flex: 1, textAlign: 'left', fontSize: 16}}>{item.name}</Text>
            </View>

            <View style={{alignSelf: 'center'}}>
                <Switch
                    // thumbTintColor={"red"}
                    tintColor={'#977272'}
                    onTintColor={'lightgreen'}  disabled={true} value={this.getSwitch(item.result)}/>
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

        if (this.state.isLoading) {
            return(
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }


        return (
            <View style={{backgroundColor:'white'}}>
                <View>
                    <FlatList
                        data={this.state.responseAPI}
                        ItemSeparatorComponent={this.renderSeparator}

                        renderItem={this._renderItem}
                        // renderRow={({item}) => <Text>{item.orgname}</Text>}
                        keyExtractor={this._keyExtractor}
                        // refreshing={false}
                        // onRefresh={() => this.getCheckListResults()}
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

            </View>
        );
    }
}
