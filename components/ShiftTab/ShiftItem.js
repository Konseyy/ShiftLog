import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Button } from "react-native";
import { stringDateFromDate, stringTimeFromDate, differenceInMinutes, displayHoursAndMinutes } from "../../helperFunctions/dateFormatFunctions";
import { softHaptic } from '../../helperFunctions/hapticFeedback';
const ShiftItem = ({item,navigation,deleteShift,editShift}) => {
    const [expanded,setExpanded] = useState(false);
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }
    function dateDifference(timeStamp1, timeStamp2){
        const diffMinutes = differenceInMinutes(timeStamp1,timeStamp2)-breakTime;
        return displayHoursAndMinutes(diffMinutes);
    }
    function dateToTimeString(date){
        return addZero(date.getHours())+":"+addZero(date.getMinutes());
    }
    useEffect(()=>{
        console.log("current item is",item);
        console.log("navigation is",navigation)
    },[])
    const ShiftData = item.item;
    const startDate = new Date(ShiftData.startTime);
    const endDate = new Date(ShiftData.endTime);
    const breakTime = ShiftData.break??0;
    return(
        <TouchableOpacity style={{marginHorizontal:2, paddingTop:5}} onPress={()=>{
            softHaptic();
            setExpanded(!expanded);
            }}>
            <View style={{flexDirection:"column"}}>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                        <Text>
                            {stringTimeFromDate(startDate)}
                        </Text>
                        <Text>
                            {stringDateFromDate(startDate,"/")}
                        </Text>
                    </View>
                    <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                        <Text>
                            {stringTimeFromDate(endDate)}
                        </Text>
                        <Text>
                            {stringDateFromDate(endDate,"/")}
                        </Text>
                    </View>
                    <View style={{flex:2, marginHorizontal:5, maxWidth:150, alignItems:"center"}}>
                        <Text>
                            {dateDifference(ShiftData.startTime,ShiftData.endTime)}
                        </Text>
                    </View>
                </View>
                {expanded&&
                <>
                <View style={{flex:2, marginHorizontal:25, marginVertical:10}}>
                    <View>
                        <Text>
                            <Text style={{fontWeight:"bold"}}>Break duration: </Text>
                            <Text>{breakTime}m</Text>
                        </Text>
                    </View>
                    <View style={{marginTop:5}}>
                        <Text style={{fontWeight:"bold"}}>
                            Additional notes:
                        </Text>
                        {ShiftData.notes?<Text>
                            {ShiftData.notes}
                        </Text>
                        :
                        <Text style={{fontStyle:"italic"}}>
                            No additional notes
                        </Text>}
                    </View>
                </View>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:1}}>
                        <Button color={"#8c8c8c"} title="edit" onPress={()=>editShift(item.index)}/>
                    </View>
                    <View style={{flex:1}}>
                        <Button color={"#6e0006"} title="delete" onPress={()=>deleteShift(item.index)}/>
                    </View>
                </View>
                </>
                }
            </View>
        </TouchableOpacity>
    )
}
export default ShiftItem;