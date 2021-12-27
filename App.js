import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FooterNav from './components/NavBar';
import {tabs} from './scenes';
import { LogBox, Image, View } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const Tab = createBottomTabNavigator();

const App = () => {
  const tabStyle = (focused) => {
    return{
      // borderRadius:5, 
      // borderColor:focused?"#000000":"#ff1234", 
      // borderWidth:focused?1:0,
      // padding:2,
      // backgroundColor:focused?"rgba(255,255,255,.8)":"",
    }
  }
  return (
    <NavigationContainer>
    <Tab.Navigator
    screenOptions={({route})=>{
      return {
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch(route.name){
            case "Shifts":
              return <View style={tabStyle(focused)}><Image style={{height:25, width:25}} source={require('./img/icons8-list-90.png')}/></View>
            case "Data":
              return <View style={tabStyle(focused)}><Image style={{height:25, width:25}} source={require('./img/icons8-cloud-100.png')}/></View>
            case "Settings":
              return <View style={tabStyle(focused)}><Image style={{height:25, width:25}} source={require('./img/icons8-settings-150.png')}/></View>
            default:
              return null;
          }
        },
      }
    }}
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
