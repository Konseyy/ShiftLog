import React, {useState, useEffect} from 'react';
import {View, Text, Button } from 'react-native';
import SimpleCircleButton from '../SimpleCircleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  useEffect(()=>{
    (async()=>{
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
      await saveShiftLogStorage();
    })();
  },[]);
  
  useEffect(()=>{
    console.log("currentinfo",shiftList,lastUpdated);
  },[shiftList,lastUpdated])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <View style={{flex: 1}}>
        <Text>Log last updated {lastUpdated}</Text>
        <Button color={"#343434"} title="Add Shift" onPress={()=>addShift()}/>
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
          onPress={() => {
            navigation.navigate('AddShift');
          }}
        />
      </View>
    </View>
  );
};
export default ShiftList;
