import React from 'react';
import {Text, Button, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ShiftTab } from '../scenes';
const Stack = createNativeStackNavigator();
const ShiftsScene = ({navigation}) => {
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
export default ShiftsScene;
