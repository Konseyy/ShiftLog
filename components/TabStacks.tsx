import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShiftTab, DataTab, SettingsTab } from '../scenes';
import {
	ShiftStackParamList,
	DataStackParamList,
	SettingsStackParamList,
} from '../types';
const ShiftStack = createNativeStackNavigator<ShiftStackParamList>();
const DataStack = createNativeStackNavigator<DataStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
export const ShiftsScene = () => {
	return (
		<ShiftStack.Navigator>
			{ShiftTab.map((scene) => {
				return (
					<ShiftStack.Screen
						key={'subScreen' + scene.name}
						name={scene.name}
						component={scene.component}
						options={scene.options}
					/>
				);
			})}
		</ShiftStack.Navigator>
	);
};
export const DataScene = () => {
	return (
		<DataStack.Navigator>
			{DataTab.map((scene) => {
				return (
					<DataStack.Screen
						key={'subScreen' + scene.name}
						name={scene.name}
						component={scene.component}
						options={scene.options}
					/>
				);
			})}
		</DataStack.Navigator>
	);
};
export const SettingsScene = () => {
	return (
		<SettingsStack.Navigator>
			{SettingsTab.map((scene) => {
				return (
					<SettingsStack.Screen
						key={'subScreen' + scene.name}
						name={scene.name}
						component={scene.component}
						options={scene.options}
					/>
				);
			})}
		</SettingsStack.Navigator>
	);
};
