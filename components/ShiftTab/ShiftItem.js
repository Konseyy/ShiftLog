import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Button } from "react-native";
const ShiftItem = ({item,navigation,deleteShift,editShift}) => {
    const [expanded,setExpanded] = useState(false);
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }
    function dateDifference(timeStamp1, timeStamp2){
        const diffMinutes = (timeStamp2-timeStamp1)/1000/60-breakTime;
        if(diffMinutes%60===0){
            return `${diffMinutes/60}h`
        }
        else{
            return `${(diffMinutes-diffMinutes%60)/60}h ${diffMinutes%60}min`
        }
    }
    function dateToDateString(date){
        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
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
        <TouchableOpacity style={{marginHorizontal:2, paddingTop:5}} onPress={()=>setExpanded(!expanded)}>
            <View style={{flexDirection:"column"}}>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                        <Text>
                            {dateToTimeString(startDate)}
                        </Text>
                        <Text>
                            {dateToDateString(startDate)}
                        </Text>
                    </View>
                    <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                        <Text>
                            {dateToTimeString(endDate)}
                        </Text>
                        <Text>
                            {dateToDateString(endDate)}
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
                            <Text style={{fontWeight:"bold"}}>Break time: </Text>
                            <Text>{breakTime}m</Text>
                        </Text>
                    </View>
                    {ShiftData.notes?
                    <View style={{marginTop:5}}>
                        <Text style={{fontWeight:"bold"}}>
                            Additional notes:
                        </Text>
                        <Text>
                            {ShiftData.notes}
                        </Text>
                    </View>
                    :
                    <Text style={{fontStyle:"italic"}}>
                        No additional notes
                    </Text>
                    }
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