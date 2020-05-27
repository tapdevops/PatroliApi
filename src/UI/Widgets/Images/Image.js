import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Image, View} from 'react-native';
import * as COLOR from '../../../Data/Constant/Color';

export default class RNImage extends Component {
    static defaultProps={
        imageResizeMode: "contain",
        imageSource: {},
        overflow: "visible",
        style: {},
    };

    static propTypes = {
        imageResizeMode: PropTypes.any,
        imageSource: PropTypes.any,
        overflow: PropTypes.any,
        style: PropTypes.any,
    };

    constructor(){
        super();
        this.state={
            loadingImage: true
        }
    }

    render(){
        return (
            <View
                style={this.props.style}>
                <Image
                    onLoadStart={()=>{this.setState({
                        loadingImage: true
                    })}}
                    onLoadEnd={()=>{
                        this.setState({
                            loadingImage: false
                        })
                    }}
                    resizeMode={this.props.imageResizeMode}
                    source={this.props.imageSource}
                    overflow={this.props.overflow}
                    style={{width:"100%", height: "100%"}}
                />
                {
                    this.state.loadingImage
                    &&
                    <View style={{width:"100%", height: "100%", position:"absolute", alignItems:"center", justifyContent:"center", backgroundColor:COLOR.GREY_SOLID_5}}>
                        <ActivityIndicator/>
                    </View>
                }
            </View>
        )
    }
}
