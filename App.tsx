import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs } from './scenes';
import { LogBox, Image, View } from 'react-native';
import { RootStackParamList } from './types';
LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
]);
const Tab = createBottomTabNavigator<RootStackParamList>();

const App = () => {
	return (
		<NavigationContainer>
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
												style={{ height: 25, width: 25 }}
												source={require('./img/icons8-list-90.png')}
											/>
										</View>
									);
								case 'Data':
									return (
										<View>
											<Image
												style={{ height: 25, width: 25 }}
												source={require('./img/icons8-cloud-100.png')}
											/>
										</View>
									);
								case 'Settings':
									return (
										<View>
											<Image
												style={{ height: 25, width: 25 }}
												source={require('./img/icons8-settings-150.png')}
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

export default App;
