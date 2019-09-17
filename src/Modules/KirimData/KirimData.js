import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import * as COLOR from "../../Data/Constant/Color";
import * as SIZE from "../../Data/Constant/Size";
import {Header} from "../../UI/Component";

export default class KirimData extends Component{
    constructor(){
        super();
    }

    componentDidMount(): void {

    }

    render(){
        return(
            <View style={{flex: 1}}>
                <Header
                    backgroundColor={"red"}
                    textLabel={"Kirim Data"}
                    textColor={COLOR.WHITE}
                    textSize={SIZE.TEXT_MEDIUM}
                />
                <View style={{
                    flex: 1
                }}>
                    <Text style={{
                        margin: 25,
                        alignSelf:"center"
                    }}>Datamu</Text>
                    <View style={{
                        marginHorizontal: "20%"
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text>FILENAME</Text>
                            <Image
                                style={{
                                    width: 25,
                                    height: 25
                                }}
                                source={require('../../Asset/Icon/ic_email.png')}
                            />
                        </View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text>FILENAME</Text>
                            <Image
                                style={{
                                    width: 25,
                                    height: 25
                                }}
                                source={require('../../Asset/Icon/ic_email.png')}
                            />
                        </View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text>FILENAME</Text>
                            <Image
                                style={{
                                    width: 25,
                                    height: 25
                                }}
                                source={require('../../Asset/Icon/ic_email.png')}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }


}
