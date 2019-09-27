import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import {Image} from '../UI/Widgets';

import * as COLOR from '../Data/Constant/Color';

import Patroli from '../Modules/Patroli/Patroli';
import TitikApi from '../Modules/TitikApi/TitikApi';
import KirimData from '../Modules/KirimData/KirimData';

const DashboardTabbar = createBottomTabNavigator(
    {
    //dashboard
        Patroli:{
            screen: Patroli,
            navigationOptions:{
                header: null,
                title: "Patroli",
                tabBarIcon: ({ focused, tintColor }) =>{
                    return(
                        <Image
                            style={{width: 30, height: 30}}
                            imageSource={focused ? require('../Asset/Icon/ic_fire_red.png') : require('../Asset/Icon/ic_fire_grey.png')}
                            imageResizeMode={"stretch"}
                        />
                    )
                },
                tabBarOptions: {
                    activeTintColor: COLOR.TAB_NAVIGATOR_ACTIVE,
                    inactiveTintColor: COLOR.TAB_NAVIGATOR_DEFAULT,
                },
            }
        },
        TitikApi:{
            screen: TitikApi,
            title: "Titik Api",
            navigationOptions:{
                header: null,
                tabBarIcon: ({ focused, tintColor }) =>{
                    return(
                        <Image
                            style={{width: 30, height: 30}}
                            imageSource={focused ? require('../Asset/Icon/ic_titikapi_red.png') : require('../Asset/Icon/ic_titikapi_grey.png')}
                            imageResizeMode={"stretch"}
                        />
                    )
                },
                tabBarOptions: {
                    activeTintColor: COLOR.TAB_NAVIGATOR_ACTIVE,
                    inactiveTintColor: COLOR.TAB_NAVIGATOR_DEFAULT,
                }
            }
        },
        KirimData:{
            screen: KirimData,
            title: "Kirim Data",
            navigationOptions:{
                header: null,
                tabBarIcon: ({ focused, tintColor }) =>{
                    return(
                        <Image
                            style={{width: 30, height: 30}}
                            imageSource={focused ? require('../Asset/Icon/ic_kirimemail_red.png') : require('../Asset/Icon/ic_kirimemail_grey.png')}
                            imageResizeMode={"stretch"}
                        />
                    )
                },
                tabBarOptions: {
                    activeTintColor: COLOR.TAB_NAVIGATOR_ACTIVE,
                    inactiveTintColor: COLOR.TAB_NAVIGATOR_DEFAULT,
                }
            }
        },
    },
    {
        initialRouteName: "Patroli"
    }
);

const StackNavigation = createStackNavigator(
    {
        //dashboard
        Dashboard:{
            screen: DashboardTabbar,
            navigationOptions:{
                header: null,
            }
        },
        Patroli:{
            screen: Patroli,
            navigationOptions:{
                header: null,
            }
        },
        KirimData:{
            screen: KirimData,
            navigationOptions:{
                header: null,
            }
        },
    },
    {
        initialRouteName: 'Dashboard',
    }
);

const ContainerNavigation = createAppContainer(StackNavigation);

export default ContainerNavigation
