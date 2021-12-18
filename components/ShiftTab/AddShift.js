import React, { useEffect,useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { stringDateFromDate, stringTimeFromDate } from "../../helperFunctions/dateFormatFunctions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { softHaptic } from "../../helperFunctions/hapticFeedback";

const AddShift = ({navigation, route}) => {
  const {params} = route;
  const saveShift = params.saveShift;
  const [startDate, setStartDate] = useState(params.current?new Date(params.current.startTime):new Date());
  const [startTime, setStartTime] = useState(params.current?new Date(params.current.startTime):new Date());
  const [endDate, setEndDate] = useState(params.current?new Date(params.current.endTime):new Date());
  const [endTime, setEndDateTime] = useState(params.current?new Date(params.current.endTime):new Date());
  const [showStartDateSelect, setShowStartDateSelect] = useState(false);
  const [showStartTimeSelect, setShowStartTimeSelect] = useState(false);
  const [showEndDateSelect, setShowEndDateSelect] = useState(false);
  const [showEndTimeSelect, setShowEndTimeSelect] = useState(false);
  const [breakTime, setBreakTime] = useState(params.current?params.current.break:0);
  const [notes,setNotes] = useState(params.current?params.current.notes:"");
  function onSelect(event, selectedDate, dateSetter, modalSetter){
    modalSetter(false);
    if(!selectedDate){
      return;
    }
    dateSetter(selectedDate);
  }
  function dateCheck(start, end){
    return end>start;
  }
  async function addShift(){
    let dateToAddStart = new Date(startDate);
    dateToAddStart.setHours(startTime.getHours(),startTime.getMinutes(),0,0);
    let dateToAddEnd = new Date(endDate);
    dateToAddEnd.setHours(endTime.getHours(),endTime.getMinutes(),0,0);
    if(!dateCheck(dateToAddStart,dateToAddEnd)){
      Alert.alert(
        "Invalid Dates",
        "Shift end time must be greater than shift start time"
      );
      return;
    }
    await saveShift({
      startTime:dateToAddStart.getTime(),
      endTime: dateToAddEnd.getTime(),
      break: breakTime,
      notes: notes,
    });
    navigation.navigate("ShiftList");
  }
  useEffect(()=>{
    if(params.current){
      navigation.setOptions({
        title:"Edit Shift"
      })
    }
    console.log("params",params);
  },[]);
  return (
    <>
      <View style={{flexDirection:"column"}}>
        <View style={{ flexDirection: "column", alignItems: 'center', justifyContent: 'center' }}>
          <View style={{marginHorizontal:20, marginTop:15, alignSelf:"stretch"}}>
            <View style={{flexDirection:"column"}}>
              <Text style={{alignSelf:"center", fontWeight:"bold"}}>
                Start of Shift
              </Text>
              <View style={{flexDirection:"row", marginTop:10}}>
                <View style={{flex:1}}/>
                <TouchableOpacity 
                style={{flex:2, alignItems:"center"}} 
                onPress={()=>{
                  softHaptic();
                  setShowStartDateSelect(true);
                }}>
                  <Text>
                    {stringDateFromDate(startDate)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{flex:2, alignItems:"center"}} 
                onPress={()=>{
                  softHaptic();
                  setShowStartTimeSelect(true);
                }}>
                  <Text>
                    {stringTimeFromDate(startTime)}
                  </Text>
                </TouchableOpacity>
                <View style={{flex:1}}/>
              </View>
            </View>
            <View style={{flexDirection:"column", marginVertical:10}}>
              <Text style={{alignSelf:"center", fontWeight:"bold"}}>
                End of Shift
              </Text>
              <View style={{flexDirection:"row", marginTop:10}}>
                <View style={{flex:1}}/>
                <TouchableOpacity 
                style={{flex:2, alignItems:"center"}} 
                onPress={()=>{
                  softHaptic();
                  setShowEndDateSelect(true);
                }}>
                  <Text>
                    {stringDateFromDate(endDate)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{flex:2, alignItems:"center"}} 
                onPress={()=>{
                  softHaptic();
                  setShowEndTimeSelect(true);
                }}>
                  <Text>
                    {stringTimeFromDate(endTime)}
                  </Text>
                </TouchableOpacity>
                <View style={{flex:1}}/>
              </View>
            </View>
            <View style={{flexDirection:"column", marginTop:10}}>
              <Text style={{fontWeight:"bold"}}>
                Break Time
              </Text>
              <Picker
              style={{backgroundColor:"white", marginTop:10}}
              selectedValue={breakTime}
              onValueChange={(value)=>setBreakTime(value)}
              >
                <Picker.Item label="0m" value={0}/>
                <Picker.Item label="15m" value={15}/>
                <Picker.Item label="30m" value={30}/>
                <Picker.Item label="45m" value={45}/>
                <Picker.Item label="60m" value={60}/>
              </Picker>
            </View>
            <View style={{marginTop:20, marginBottom:20, alignSelf:"stretch", flexDirection:"column", alignItems:"center"}}>
              <Text style={{fontWeight:"bold", alignSelf:"flex-start"}}>
                Additional notes
              </Text>
              <TextInput multiline={true} textAlignVertical="top" defaultValue={notes} style={{marginTop:10, backgroundColor:"#FFFFFF", color:"#000000", alignSelf:"stretch"}} onChangeText={(txt)=>setNotes(txt)}/>
            </View>
          </View>
        </View>
      </View>
      <Button title="Save" onPress={()=>addShift()}/>
      {showStartDateSelect&&<DateTimePicker mode="date" value={startDate} onChange={(e,s)=>onSelect(e,s,setStartDate,setShowStartDateSelect)}/>}
      {showStartTimeSelect&&<DateTimePicker mode="time" value={startTime} onChange={(e,s)=>onSelect(e,s,setStartTime,setShowStartTimeSelect)}/>}
      {showEndDateSelect&&<DateTimePicker mode="date" value={endDate} onChange={(e,s)=>onSelect(e,s,setEndDate,setShowEndDateSelect)}/>}
      {showEndTimeSelect&&<DateTimePicker mode="time" value={endTime} onChange={(e,s)=>onSelect(e,s,setEndDateTime,setShowEndTimeSelect)}/>}
    </>
      
  );
}
export default AddShift;