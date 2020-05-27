import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Icon, Image} from '../UI/Widgets';

import LoginOnboarding from '../Modules/Login/LoginOnboarding';
import LoginLocationForm from '../Modules/Login/LoginLocationForm';
import LoginAuthForm from '../Modules/Login/LoginAuthForm';

import Patroli from '../Modules/Patroli/Patroli';
import PatroliSession from "../Modules/Patroli/PatroliSession";
import PatroliApiForm from "../Modules/Patroli/PatroliApiForm";

import TitikApi from '../Modules/TitikApi/TitikApi';
import TitikApiPenanganan from '../Modules/TitikApi/TitikApiPenanganan';
import TitikApiPenangananDetail from '../Modules/TitikApi/TitikApiPenangananDetail';
import TitikApiUpdateForm from '../Modules/TitikApi/TitikApiUpdateForm';
import TitikApiManualForm from '../Modules/TitikApi/TitikApiManualForm';
import TitikPanasUpdateForm from '../Modules/TitikApi/TitikPanasUpdateForm';
import PatroliHistory from '../Modules/PatroliHistory/PatroliHistory';
import PatroliHistoryDetail from '../Modules/PatroliHistory/PatroliHistoryDetail';
import Setting from '../Modules/Settings/Setting';
import Camera from '../Modules/Camera';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator(){
    return(
        <Stack.Navigator
            initialRouteName={"LoginOnboarding"}
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen
                name={"LoginOnboarding"}
                component={LoginOnboarding}
            />
            <Stack.Screen
                name={"LoginLocationForm"}
                component={LoginLocationForm}
            />
            <Stack.Screen
                name={"LoginAuthForm"}
                component={LoginAuthForm}
            />
            <Stack.Screen
                name={"DashboardAdmin"}
                component={TabNavigatorAdmin}
            />
            <Stack.Screen
                name={"DashboardPatroli"}
                component={TabNavigatorPatroli}
            />
            <Stack.Screen
                name={"Patroli"}
                component={Patroli}
            />
            <Stack.Screen
                name={"PatroliSession"}
                component={PatroliSession}
            />
            <Stack.Screen
                name={"PatroliApiForm"}
                component={PatroliApiForm}
            />
            <Stack.Screen
                name={"PatroliHistory"}
                component={PatroliHistory}
            />
            <Stack.Screen
                name={"PatroliHistoryDetail"}
                component={PatroliHistoryDetail}
            />
            <Stack.Screen
                name={"TitikApiPenanganan"}
                component={TitikApiPenanganan}
            />
            <Stack.Screen
                name={"TitikApiPenangananDetail"}
                component={TitikApiPenangananDetail}
            />
            <Stack.Screen
                name={"TitikApiUpdateForm"}
                component={TitikApiUpdateForm}
            />
            <Stack.Screen
                name={"TitikApiManualForm"}
                component={TitikApiManualForm}
            />
            <Stack.Screen
                name={"TitikPanasUpdateForm"}
                component={TitikPanasUpdateForm}
            />
            <Stack.Screen
                name={"Setting"}
                component={Setting}
            />
            <Stack.Screen
                name={"Camera"}
                component={Camera}
            />
        </Stack.Navigator>
    )
}

function TabNavigatorAdmin(){
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    switch(route.name){
                        case "TitikApi":
                            return(
                                <Image
                                    style={{width: 30, height: 30}}
                                    imageSource={focused ? require('../Asset/Icon/ic_titikapi_red.png') : require('../Asset/Icon/ic_titikapi_grey.png')}
                                    imageResizeMode={"stretch"}
                                />
                            );
                        case "Sinkronisasi":
                            return(
                                <Image
                                    style={{width: 30, height: 30}}
                                    imageSource={focused ? require('../Asset/Icon/ic_kirimemail_red.png') : require('../Asset/Icon/ic_kirimemail_grey.png')}
                                    imageResizeMode={"stretch"}
                                />
                            );
                        case "Setting":
                            return(
                                <Icon
                                    iconColor={focused ? "rgba(255,50,50,1)" : "rgba(166,166,166,1)"}
                                    iconName={"settings"}
                                    iconSize={30}
                                />
                            );
                    }
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="TitikApi" component={TitikApi} />
            <Tab.Screen name="Sinkronisasi" component={PatroliHistory} />
            <Tab.Screen name="Setting" component={Setting} />
        </Tab.Navigator>
    )
}

function TabNavigatorPatroli(){
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    switch(route.name){
                        case "TitikApi":
                            return(
                                <Image
                                    style={{width: 30, height: 30}}
                                    imageSource={focused ? require('../Asset/Icon/ic_titikapi_red.png') : require('../Asset/Icon/ic_titikapi_grey.png')}
                                    imageResizeMode={"stretch"}
                                />
                            );
                        case "Patroli":
                            return(
                                <Image
                                    style={{width: 30, height: 30}}
                                    imageSource={focused ? require('../Asset/Icon/ic_fire_red.png') : require('../Asset/Icon/ic_fire_grey.png')}
                                    imageResizeMode={"stretch"}
                                />
                            );
                        case "Sinkronisasi":
                            return(
                                <Image
                                    style={{width: 30, height: 30}}
                                    imageSource={focused ? require('../Asset/Icon/ic_kirimemail_red.png') : require('../Asset/Icon/ic_kirimemail_grey.png')}
                                    imageResizeMode={"stretch"}
                                />
                            );
                        case "Setting":
                            return(
                                <Icon
                                    iconColor={focused ? "rgba(255,50,50,1)" : "rgba(166,166,166,1)"}
                                    iconName={"settings"}
                                    iconSize={30}
                                />
                            );
                    }
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="TitikApi" component={TitikApi} />
            <Tab.Screen name="Patroli" component={Patroli} />
            <Tab.Screen name="Sinkronisasi" component={PatroliHistory} />
            <Tab.Screen name="Setting" component={Setting} />
        </Tab.Navigator>
    )
}

export default class Router extends Component{
    constructor(){
        super()
    }

    render(){
        return(
            <NavigationContainer>
                <MainStackNavigator/>
            </NavigationContainer>
        )
    }
}
