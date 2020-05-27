import React from 'react';

import {Modal, Text} from "../../../UI/Widgets";
import {TouchableOpacity, View} from "react-native";
import * as SIZE from "../../../Data/Constant/Size";
import * as COLOR from "../../../Data/Constant/Color";

export function ModalContinue(props){
    const {actionContinue, actionSelesai, modalClose, visible} = props;
    return(
        <Modal
            modalClose={modalClose}
            modalVisible={visible}
        >
            <View style={{
                flex: 1,
                borderRadius: 10,
                backgroundColor:COLOR.WHITE,
                alignItems:"center",
                justifyContent:"center"
            }}>
                <Text
                    style={{marginBottom: 20}}
                    textSize={SIZE.TEXT_LARGE}
                    textFontFamily={"BOLD"}
                    textLabel={"Lanjut patroli?"}
                />
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity
                        onPress={actionContinue}
                        style={{
                            width: 75,
                            height: 75,
                            borderRadius: 37.5,
                            backgroundColor:COLOR.WHITE,
                            borderColor:COLOR.RED_1,
                            borderWidth: 1,
                            alignItems:'center',
                            justifyContent:"center",
                            marginHorizontal: 10,
                            marginTop: 10
                        }}>
                        <Text
                            textColor={COLOR.RED_1}
                            textLabel={"Lanjut"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={actionSelesai}
                        style={{
                            width: 75,
                            height: 75,
                            borderRadius: 37.5,
                            backgroundColor:COLOR.RED_1,
                            alignItems:'center',
                            justifyContent:"center",
                            marginHorizontal: 10,
                            marginTop: 10
                        }}>
                        <Text
                            textColor={COLOR.WHITE}
                            textLabel={"Selesai"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}