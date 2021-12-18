import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, Alert } from 'react-native';
import SimpleCircleButton from '../SimpleCircleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ShiftItem from './ShiftItem';
const ShiftList = ({navigation, route}) => {
  const [shiftList, setShiftList] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  useEffect(()=>{
    console.log("currentinfo",shiftList.length);
  },[shiftList,lastUpdated]);
  function refresh()
  {
    setRefreshList(!refreshList);
  }
  async function addShiftScene(){
    await saveShiftLogStorage();
    navigation.navigate('AddShift',{
      saveShift: async (shiftObject) =>{
        shiftList.push(shiftObject);
        await saveShiftLogStorage();
        refresh();
      }
    })
  }
  async function deleteShift(index){
    console.log("delete",index)
    Alert.alert("Delete Shift",
    "Are you sure you want to delete the selected shift?",
    [
      {text:"Yes",onPress:async ()=>{
        shiftList.splice(index,1)
        refresh();
        await saveShiftLogStorage();
      }},
      {text:"No"}
    ])
    
  }
  async function editShift(index){
    console.log("edit",index);
    navigation.navigate('AddShift',{
      saveShift: async (shiftObject) => {
        let newList = shiftList;
        newList[index]=shiftObject;
        setShiftList(newList);
        await saveShiftLogStorage();
        refresh();
      },
      current: {
        ...shiftList[index],
        index:index
      }
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
  
  
  const listHeader = () => {
    return(
      <View style={{flexDirection:"row", marginHorizontal:2, marginBottom:4, marginTop:6}}>
        <View style={{flex:1, alignItems:"center"}}>
          <Text style={{fontWeight:"bold"}}>
            Shift Start
          </Text>
        </View>
        <View style={{flex:1, alignItems:"center"}}>
          <Text style={{fontWeight:"bold"}}>
            Shift End
          </Text>
        </View>
        <View style={{flex:2, alignItems:"center", maxWidth:150, marginHorizontal:5}}>
          <Text style={{fontWeight:"bold"}}>
            Duration
          </Text>
        </View>
      </View>
    )
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <View style={{flex: 1}}>
        {/* <Text>Log last updated {lastUpdated}</Text> */}
        <FlatList
        ListHeaderComponent={listHeader}
        data={shiftList}
        renderItem={(item)=>{
          return <ShiftItem item={item} navigation={navigation} deleteShift={deleteShift} editShift={editShift}/>;
        }}
        keyExtractor={(item,index)=>{
          return item.endTime.toString()+item.startTime.toString()+item.notes;
        }}
        extraData={refreshList}
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
          onPress={() =>addShiftScene()}
        />
      </View>
    </View>
  );
};
export default ShiftList;
