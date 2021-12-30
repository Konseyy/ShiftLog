import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ShiftTab, DataTab, SettingsTab } from '../scenes';
const Stack = createNativeStackNavigator();
export const ShiftsScene = ({navigation}) => {
  return (
    <Stack.Navigator>
      {ShiftTab.map((shiftTabScene)=>{
        return (
          <Stack.Screen key={"subScreen"+shiftTabScene.name} name={shiftTabScene.name} component={shiftTabScene.component} options={shiftTabScene.options}/>
        )
      })}
      
    </Stack.Navigator>
  );
};
export const DataScene = ({navigation}) => {
    return (
      <Stack.Navigator>
        {DataTab.map((shiftTabScene)=>{
          return (
            <Stack.Screen key={"subScreen"+shiftTabScene.name} name={shiftTabScene.name} component={shiftTabScene.component} options={shiftTabScene.options}/>
          )
        })}
        
      </Stack.Navigator>
    );
};
export const SettingsScene = ({navigation}) => {
    return (
      <Stack.Navigator>
        {SettingsTab.map((shiftTabScene)=>{
          return (
            <Stack.Screen key={"subScreen"+shiftTabScene.name} name={shiftTabScene.name} component={shiftTabScene.component} options={shiftTabScene.options}/>
          )
        })}
        
      </Stack.Navigator>
    );
};
