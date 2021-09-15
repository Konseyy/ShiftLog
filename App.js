import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FooterNav from './components/NavBar';
import {tabs} from './scenes';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Tab.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Shifts"
    backBehavior="history"
    tabBarActiveTintColor= '#000000'
    // tabBar={FooterNav}
    >
      {tabs.map((scene)=>{
        return (
          <Tab.Screen key={scene.name} name={scene.name} component={scene.component} options={scene.options??null}/>
        );
      })}
    </Tab.Navigator>
  </NavigationContainer>
  );
};

export default App;
