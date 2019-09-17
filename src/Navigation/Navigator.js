import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {Icon} from '../UI/Widgets';
import * as COLOR from '../Data/Constant/Color';
import * as SIZE from '../Data/Constant/Size';

import Patroli from '../Modules/Patroli/Patroli';
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
                        <Icon
                            iconName={"home"}
                            iconColor={tintColor}
                            iconSize={SIZE.ICON_LARGE}/>
                    )
                },
                tabBarOptions: {
                    activeTintColor: COLOR.TAB_NAVIGATOR_ACTIVE,
                    inactiveTintColor: COLOR.TAB_NAVIGATOR_DEFAULT,
                },
            }
        },
        KirimData:{
            screen: KirimData,
            title: "Kirim Data",
            navigationOptions:{
                header: null,
                tabBarIcon: ({ focused, tintColor }) =>{
                    return(
                        <Icon
                            iconName={"account-circle"}
                            iconColor={tintColor}
                            iconSize={SIZE.ICON_LARGE}/>
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
    },
    {
        initialRouteName: 'Dashboard',
    }
);

const ContainerNavigation = createAppContainer(StackNavigation);

export default ContainerNavigation
