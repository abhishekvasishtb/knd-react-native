import React from 'react';
import {
    Text,
    View,
    Platform,
    TouchableOpacity,
    UIManager,
    LayoutAnimation,
} from 'react-native';


export default class ExpendableRow extends React.Component {
    constructor(props) {
        super(props);
        if( Platform.OS === 'android' )
        {

            UIManager.setLayoutAnimationEnabledExperimental(true);

        }
        this.state = {
            expanded    : true,
            textLayoutHeight: 0,
            updatedHeight: 0,
            expand: false
        };
    }


    expand_collapse_Function =()=>
    {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );

        if( this.state.expand == false )
        {
            this.setState({
                updatedHeight: this.state.textLayoutHeight + 5,
                expand: true,
                buttonText: 'Click Here To Collapse'
            });
        }
        else
        {
            this.setState({
                updatedHeight: 0,
                expand: false,
                buttonText: 'Click Here To Expand'
            });
        }
    }

    getHeight(height)
    {
        this.setState({ textLayoutHeight: height });
    }



    render() {
        return(
            <TouchableOpacity
                onPress = { this.expand_collapse_Function }
                style={{flex: 1,
                    alignSelf: 'stretch',
                    flexDirection: 'column',
                    minHeight: 70,
                }}
            >


                <View style={{margin:5}}>
                    <Text style={{color: 'gray'}}>{this.props.date}</Text>
                </View>
                {/*<TouchableOpacity style={{ flex: 1, alignSelf: 'stretch', width: '88%', margin:5}}*/}
                {/*onPress={console.log(item.id) }>*/}
                <View style={{
                    flex: 1, marginLeft:5}}>

                    <Text
                        numberOfLines={2} style={{flex: 1, textAlign: 'left', fontSize: 16}}>{this.props.orgname}</Text>
                </View>
                {/*</TouchableOpacity>*/}
                <Text style={{margin:5, fontWeight:"500", color:'#716c6e'}}>{this.props.type}</Text>
                <View style={{height: this.state.updatedHeight, overflow: 'hidden'}} >
                    <Text style={{marginLeft: 10, fontSize: 14}}
                          onLayout = {( value ) => this.getHeight( value.nativeEvent.layout.height )}>Адрес: {this.props.address}</Text></View>
            </TouchableOpacity>


        )
    }
}