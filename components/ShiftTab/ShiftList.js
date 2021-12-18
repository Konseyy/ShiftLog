import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList } from 'react-native';
import SimpleCircleButton from '../SimpleCircleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ShiftItem from './ShiftItem';
const ShiftList = ({navigation, route}) => {
  const [shiftList, setShiftList] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  async function addShift(){
    await saveShiftLogStorage();
    navigation.navigate('AddShift',{
      shiftList: shiftList,
    })
  }
  async function saveShiftLogStorage(){
    const JSONShifts = JSON.stringify({
      shifts: shiftList,
      lastUpdated: new Date().getTime(),
    });
    await AsyncStorage.setItem("savedShifts",JSONShifts);
  }
  async function refreshFromStorage(){
    const savedShiftsRetrieved = await AsyncStorage.getItem("savedShifts");
    if(savedShiftsRetrieved){
      const convertedShifts = JSON.parse(savedShiftsRetrieved);
      setShiftList(convertedShifts.shifts);
      const retrievedLastUpdated = new Date(convertedShifts.lastUpdated);
      setLastUpdated(retrievedLastUpdated.toLocaleString());
    }
    else{
      const defaultStorage = {
        shifts:[],
        lastUpdated: new Date().getTime(),
      };
      await AsyncStorage.setItem("savedShifts",JSON.stringify(defaultStorage));
      setLastUpdated(new Date(defaultStorage.lastUpdated).toLocaleString());
    }
  }
  async function clearData(){
    const defaultStorage = {
      shifts:[],
      lastUpdated: new Date().getTime(),
    };
    await AsyncStorage.setItem("savedShifts",JSON.stringify(defaultStorage));
    setLastUpdated(new Date(defaultStorage.lastUpdated).toLocaleString());
    setShiftList(defaultStorage.shifts);
  }
  useEffect(() => { //Refresh every time load this scene
    const unsubscribe = navigation.addListener('focus', () => {
     refreshFromStorage();
    });
    return unsubscribe;
  }, [navigation]);
  
  useEffect(()=>{
    console.log("currentinfo",shiftList);
  },[shiftList,lastUpdated]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <View style={{flex: 1}}>
        {/* <Text>Log last updated {lastUpdated}</Text> */}
        <FlatList
        ListHeaderComponent={
          <View style={{flexDirection:"row", marginHorizontal:2, marginBottom:4}}>
            <View style={{flex:1, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>
                Start Time
              </Text>
            </View>
            <View style={{flex:1, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>
                End Time
              </Text>
            </View>
            <View style={{flex:2, alignItems:"center", maxWidth:150, marginHorizontal:5}}>
              <Text style={{fontWeight:"bold"}}>
                Duration
              </Text>
            </View>
          </View>
        }
        data={shiftList}
        renderItem={(item)=>{
          return <ShiftItem item={item} navigation={navigation}/>;
        }}
        extraData={shiftList}
        />
        <Button title="delete data" onPress={()=>clearData()}/>
        <SimpleCircleButton
          style={{
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            bottom: 25,
            right:25,
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
          }}
          circleDiameter={55}
          onPress={() =>addShift()}
        />
      </View>
    </View>
  );
};
export default ShiftList;
