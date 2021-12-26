import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import SimpleCircleButton from '../SimpleCircleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import { getShiftDurationInMinutes, displayHoursAndMinutes } from '../../helperFunctions/dateFormatFunctions';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import ShiftItem from './ShiftItem';
const ShiftList = ({navigation, route}) => {
  const [shiftList, setShiftList] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(3);
  const [minutesInInterval, setMinutesInInterval] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    console.log("length of shift list",shiftList.length);
  },[shiftList,lastUpdated]);
  function refresh()
  {
    setRefreshList(!refreshList);
  }
  async function addShiftScene(){
    await saveShiftLogStorage();
    softHaptic();
    navigation.navigate('AddShift',{
      saveShift: async (shiftObject) =>{
        shiftList.push(shiftObject);
        await saveShiftLogStorage();
        softHaptic();
        refresh();
      }
    })
  }
  async function deleteShift(index){
    softHaptic();
    Alert.alert("Delete Shift",
    "Are you sure you want to delete the selected shift?",
    [
      {text:"Yes",onPress:async ()=>{
        shiftList.splice(index,1)
        await saveShiftLogStorage();
        refresh();
      }},
      {text:"No"}
    ])
    
  }
  async function editShift(index){
    softHaptic();
    navigation.navigate('AddShift',{
      saveShift: async (shiftObject) => {
        let newList = shiftList;
        newList[index]=shiftObject;
        setShiftList(newList);
        await saveShiftLogStorage();
        softHaptic();
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
      updateTimeClocked(convertedShifts.shifts);
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
  function filterData(data,filter){
    let returnData;
    switch(filter){
      case 1:
        let today = new Date();
        let dayOTW = today.getDay();
        let monday = new Date(today.setDate(today.getDate()-(dayOTW===0?6:(dayOTW-1))));
        monday.setHours(0,0,0,0);
        let nextMonday = new Date(monday.getTime());
        nextMonday.setDate(nextMonday.getDate()+7);
        returnData = data.filter((value)=>{
          const currentDate = new Date(value.startTime);
          return (currentDate>monday && currentDate<nextMonday);
        })
        break;
      case 2:
        let startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        let startOfNext = new Date(startOfMonth.getTime()).setMonth(startOfMonth.getMonth()+1);
        returnData = data.filter((value)=>{
          const currentDate = new Date(value.startTime);
          return (currentDate>startOfMonth && currentDate < startOfNext);
        });
        break;
      case 3:
        returnData = data;
        break;
      default:
        break;
    }
    returnData.sort((first,second)=>{ // sort data by date 
      const firstDate = new Date(first.startTime);
      const secondDate = new Date(second.startTime);
      return firstDate<secondDate;
    })
    return returnData;
  }
  function updateTimeClocked(shifts=shiftList){
    let newMinutes = 0;
    filterData(shifts,currentFilter).forEach((shiftObject)=>{
      newMinutes+=getShiftDurationInMinutes(shiftObject);
    });
    setMinutesInInterval(displayHoursAndMinutes(newMinutes));
  }
  useEffect(() => { //Refresh every time load this scene
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      refreshFromStorage()
      .then(()=>setLoading(false));
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(()=>{
    updateTimeClocked();
  },[currentFilter]);
  
  const ListHeader = () => {
    return(
      <View style={{flexDirection:"column"}}>
        <View style={{height:50, backgroundColor:"#d6d6d6"}}>
          <Picker
            selectedValue={currentFilter}
            onValueChange={(value)=>{
              softHaptic();
              setCurrentFilter(value);
            }}
          >
            <Picker.Item label="Current week" value={1}/>
            <Picker.Item label="Current month" value={2}/>
            <Picker.Item label="All" value={3}/>
          </Picker>
        </View>   
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
      </View>
    )
  }
  const ListFooter = () => {
    return (
      <View style={{alignSelf:"stretch", paddingTop:5, paddingBottom:5, borderTopColor:"#000000", borderTopWidth:.5}}>
          <Text style={{
            fontSize:15, 
            alignSelf:"center",
            fontWeight:"bold"
          }}>
            {`Clocked time in selected period: ${minutesInInterval}`}
          </Text>
      </View>
    );
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
        ListHeaderComponent={ListHeader}
        data={loading?null:filterData(shiftList,currentFilter)}
        renderItem={(item)=>{
          return <ShiftItem item={item} navigation={navigation} deleteShift={deleteShift} editShift={editShift}/>;
        }}
        keyExtractor={(item,index)=>{
          return item.endTime.toString()+item.startTime.toString()+item.notes;
        }}
        extraData={refreshList}
        />
        <ListFooter/>
        <TouchableOpacity onPress={() =>addShiftScene()}
        style={{
          position:"absolute",
          right:15,
          bottom:40
        }}
        >
          <View style={{backgroundColor:"#26a5ff", paddingVertical:7, paddingHorizontal:18, borderRadius:8}}>
            <Text style={{fontSize:17, color:"white", fontWeight:"bold"}}>
              New Shift
            </Text>
          </View>
        </TouchableOpacity>
        {/* <SimpleCircleButton
          style={{
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            bottom: 35,
            right:25,
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
          }}
          circleDiameter={55}
          onPress={() =>addShiftScene()}
        /> */}
      </View>
    </View>
  );
};
export default ShiftList;
