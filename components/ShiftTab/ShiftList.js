import React, {useState, useEffect, useMemo} from 'react';
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
  const [currentFilter, setCurrentFilter] = useState("all");
  const [minutesInInterval, setMinutesInInterval] = useState();
  const [loading, setLoading] = useState(true);
  const [sorter, setSorter] = useState("start");
  const [sortingDirection, setSortingDirection] = useState("descending");
  useEffect(()=>{
    console.log("length of shift list",shiftList.length);
  },[shiftList,lastUpdated]);
  function refresh()
  {
    setRefreshList(!refreshList);
    updateTimeClocked();
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
        setShiftList(filterData(newList,"start","descending","all"));
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
      updateTimeClocked();
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
  function filterData(data, sort=sorter, direction=sortingDirection,filter=currentFilter){
    let returnData;
    switch(filter){
      case "week":
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
      case "month":
        let startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        let startOfNext = new Date(startOfMonth.getTime()).setMonth(startOfMonth.getMonth()+1);
        returnData = data.filter((value)=>{
          const currentDate = new Date(value.startTime);
          return (currentDate>startOfMonth && currentDate < startOfNext);
        });
        break;
      case "all":
        returnData = data;
        break;
      default:
        break;
    }
    returnData.sort((first,second)=>{ // sort data
      let firstDate;
      let secondDate;
      switch(sort){
        case "start":
          firstDate = new Date(first.startTime);
          secondDate = new Date(second.startTime);
          if(direction==="ascending"){
            return firstDate>secondDate;
          }
          else if(direction==="descending"){
            return firstDate<secondDate;
          }
          break;
        case "end":
          firstDate = new Date(first.endTime);
          secondDate = new Date(second.endTime);
          if(direction==="ascending"){
            return firstDate>secondDate;
          }
          else if(direction==="descending"){
            return firstDate<secondDate;
          }
          break;
        case "duration":
          firstDate = getShiftDurationInMinutes(first);
          secondDate = getShiftDurationInMinutes(second);
          if(direction==="ascending"){
            return firstDate>secondDate;
          }
          else if(direction==="descending"){
            return firstDate<secondDate;
          }
          break;
        default:
          break;
      } 
    })
    return returnData;
  }
  const filteredData = useMemo(()=>filterData(shiftList),[shiftList,sortingDirection,sorter,currentFilter]);
  function updateTimeClocked(shifts=filteredData){
    let newMinutes = 0;
    filterData(shifts,currentFilter).forEach((shiftObject)=>{
      newMinutes+=getShiftDurationInMinutes(shiftObject);
    });
    setMinutesInInterval(displayHoursAndMinutes(newMinutes));
  }
  // useEffect(() => { //Refresh every time load this scene
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setLoading(true);
  //     refreshFromStorage()
  //     .then(()=>setLoading(false));
  //   });
  //   return unsubscribe;
  // }, [navigation]);
  useEffect(()=>{
    updateTimeClocked();
  },[shiftList,currentFilter])
  useEffect(()=>{
    refreshFromStorage()
    .then(()=>setLoading(false));
  },[])
  useEffect(()=>{
    setSortingDirection("descending");
  },[sorter]);
  const FilterSelect = useMemo(()=>()=>{
    return(
    <View style={{height:50, marginHorizontal:5}}>
          <Picker
            selectedValue={currentFilter}
            onValueChange={(value)=>{
              softHaptic();
              setCurrentFilter(value);
            }}
          >
            <Picker.Item label="Current week" value={"week"}/>
            <Picker.Item label="Current month" value={"month"}/>
            <Picker.Item label="All" value={"all"}/>
          </Picker>
        </View> )
  }, [currentFilter])
  const ListHeader = useMemo(()=>() => {
    return(
      <View>
        <View style={{flexDirection:"row", marginHorizontal:2, paddingBottom:4, paddingTop:6, borderBottomColor:"#000000", borderBottomWidth:.5, borderTopWidth:.5, borderTopColor:"#000000"}}>
          <TouchableOpacity style={{flex:1, alignItems:"center"}} onPress={()=>{
            if(sorter==="start"){
              if(sortingDirection==="ascending"){
                setSortingDirection("descending");
              }
              else{
                setSortingDirection("ascending");
              }
            }
            else{
              setSorter("start");
            }
          }}>
            <Text style={{fontWeight:"bold"}}>
              Shift Start
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1, alignItems:"center"}} onPress={()=>{
            if(sorter==="end"){
              if(sortingDirection==="ascending"){
                setSortingDirection("descending");
              }
              else{
                setSortingDirection("ascending");
              }
            }
            else{
              setSorter("end");
              setSortingDirection("descending");
            }
          }}>
            <Text style={{fontWeight:"bold"}}>
              Shift End
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:2, alignItems:"center", maxWidth:150, marginHorizontal:5}} onPress={()=>{
            if(sorter==="duration"){
              if(sortingDirection==="ascending"){
                setSortingDirection("descending");
              }
              else{
                setSortingDirection("ascending");
              }
            }
            else{
              setSorter("duration");
              setSortingDirection("descending");
            }
          }}>
            <Text style={{fontWeight:"bold"}}>
              Duration
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },[currentFilter, sortingDirection, sorter]);
  const ListFooter = useMemo(()=>({style}) => {
    return (
      <View style={{...style}}>
          <Text style={{
            fontSize:15, 
            fontWeight:"bold",
            marginLeft:15,
            marginVertical:3,
          }}>
            {`Total in Period: ${minutesInInterval}`}
          </Text>
          <Button color={"#26a5ff"} title="add shift" onPress={() =>addShiftScene()}/>
      </View>
    );
  },[minutesInInterval, currentFilter]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems:"stretch"
      }}
    >
      {!loading&&<View style={{flex:1, flexDirection:"column"}}>
        <FilterSelect/>
        <ListHeader style={{flex:1}}/>
        <View style={{flex:8}}>
          <FlatList
          data={loading?null:filteredData}
          renderItem={(item)=>{
            return <ShiftItem item={item} navigation={navigation} deleteShift={deleteShift} editShift={editShift}/>;
          }}
          keyExtractor={(item,index)=>{
            return item.endTime.toString()+item.startTime.toString()+item.notes+index.toString();
          }}
          extraData={refreshList}
          contentContainerStyle={{paddingBottom:5}}
          />
        </View>
        <ListFooter style={{
          width:"100%",
          flexDirection:"column",
          justifyContent:"center",
          borderTopColor:"#000000",
          borderTopWidth:.6,
        }}/>
      </View>}
    </View>
  );
};
export default ShiftList;
