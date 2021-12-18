import React, { useEffect,useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [notes,setNotes] = useState(params.current?params.current.notes:"");
  function stringDateFromDate(date){
    let year = date.getFullYear();
    let month = (date.getMonth()+1).toString();
    if(month.length===1)month='0'+month;
    let day = date.getDate().toString();
    if(day.length===1)day='0'+day;
    return year+"-"+month+"-"+day;
  }
  function stringTimeFromDate(date){
    new Date().getMonth();
    let hours = date.getHours().toString();
    if(hours.length===1) hours="0"+hours;
    let minutes = date.getMinutes().toString();
    if(minutes.length===1) minutes="0"+minutes;
    return hours+":"+minutes;
  }
  function onSelect(event, selectedDate, dateSetter, modalSetter){
    modalSetter(false);
    if(!selectedDate){
      return;
    }
    dateSetter(selectedDate);
  }
  function dateCheck(){
    //TODO
    return true;
  }
  async function addShift(){
    if(!dateCheck()){
      //TODO show alert
      return;
    }
    let dateToAddStart = new Date(startDate);
    dateToAddStart.setHours(startTime.getHours(),startTime.getMinutes(),0,0);
    let dateToAddEnd = new Date(endDate);
    dateToAddEnd.setHours(endTime.getHours(),endTime.getMinutes(),0,0);
    await saveShift({
      startTime:dateToAddStart.getTime(),
      endTime: dateToAddEnd.getTime(),
      notes: notes,
    });
    navigation.navigate("ShiftList");
  }
  useEffect(()=>{
    console.log("parm",params);
  },[]);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Add Shift Screen</Text>
            <Text>Start</Text>
          <View style={{flexDirection:"row", paddingBottom:20}}>
            <Button title={stringDateFromDate(startDate)} onPress={()=>setShowStartDateSelect(true)}/>
            <Button title={stringTimeFromDate(startTime)} onPress={()=>setShowStartTimeSelect(true)}/>
          </View>
            <Text>End</Text>
          <View style={{flexDirection:"row", paddingBottom:20}}>
            <Button title={stringDateFromDate(endDate)} onPress={()=>setShowEndDateSelect(true)}/>
            <Button title={stringTimeFromDate(endTime)} onPress={()=>setShowEndTimeSelect(true)}/>
          </View>
          <View style={{paddingBottom:20}}>
            <Text>Additional notes</Text>
            <TextInput defaultValue={notes} style={{backgroundColor:"#FFFFFF"}} onChangeText={(txt)=>setNotes(txt)}/>
          </View>
          <Button title="Save" onPress={()=>addShift()}/>
          {showStartDateSelect&&<DateTimePicker mode="date" value={startDate} onChange={(e,s)=>onSelect(e,s,setStartDate,setShowStartDateSelect)}/>}
          {showStartTimeSelect&&<DateTimePicker mode="time" value={startTime} onChange={(e,s)=>onSelect(e,s,setStartTime,setShowStartTimeSelect)}/>}
          {showEndDateSelect&&<DateTimePicker mode="date" value={endDate} onChange={(e,s)=>onSelect(e,s,setEndDate,setShowEndDateSelect)}/>}
          {showEndTimeSelect&&<DateTimePicker mode="time" value={endTime} onChange={(e,s)=>onSelect(e,s,setEndDateTime,setShowEndTimeSelect)}/>}
        </View>
    );
}
export default AddShift;