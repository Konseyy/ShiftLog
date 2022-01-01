import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import {
	NavigationContainer,
	DefaultTheme,
	Theme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs } from './scenes';
import { LogBox, Image, View } from 'react-native';
import { useSettings } from './components/SettingsProvider';
import { RootStackParamList } from './types';
import useColors from './helperFunctions/useColors';
LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
	'Remote debugger is in a background tab which may cause apps to perform slowly',
	'Require cycle: node_modules\\rn-fetch-blob\\index.js',
]);
const Tab = createBottomTabNavigator<RootStackParamList>();

const Content = () => {
	const { darkMode } = useSettings();
	const colors = useColors();
	return (
		<NavigationContainer theme={colors.theme}>
			<Tab.Navigator
				screenOptions={({ route }) => {
					return {
						headerShown: false,
						tabBarIcon: () => {
							switch (route.name) {
								case 'Shifts':
									return (
										<View>
											<Image
												style={{
													height: 25,
													width: 25,
													tintColor: darkMode ? 'white' : 'black',
												}}
												source={require('./img/icons-list.png')}
											/>
										</View>
									);
								case 'Data':
									return (
										<View>
											<Image
												style={{
													height: 25,
													width: 25,
													tintColor: darkMode ? 'white' : 'black',
												}}
												source={
													darkMode
														? require('./img/icons-data-dark.png')
														: require('./img/icons-data-light.png')
												}
											/>
										</View>
									);
								case 'Settings':
									return (
										<View>
											<Image
												style={{
													height: 25,
													width: 25,
													tintColor: darkMode ? 'white' : 'black',
												}}
												source={
													darkMode
														? require('./img/icons-settings-dark.png')
														: require('./img/icons-settings-light.png')
												}
											/>
										</View>
									);
								default:
									return null;
							}
						},
					};
				}}
				initialRouteName="Shifts"
				backBehavior="history"
			>
				{Tabs.map((scene) => {
					return (
						<Tab.Screen
							key={scene.name}
							name={scene.name}
							component={scene.component}
							options={scene.options ?? {}}
						/>
					);
				})}
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default Content;
