import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Button } from "react-native";
const ShiftItem = ({item,navigation,deleteShift,editShift}) => {
    const [expanded,setExpanded] = useState(false);
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }
    function dateDifference(timeStamp1, timeStamp2){
        const diffMinutes = (timeStamp2-timeStamp1)/1000/60;
        if(diffMinutes%60===0){
            return `${diffMinutes/60}h`
        }
        else{
            return `${(diffMinutes-diffMinutes%60)/60}h ${diffMinutes%60}min`
        }
    }
    useEffect(()=>{
        console.log("current item is",item);
        console.log("navigation is",navigation)
    },[])
    const ShiftData = item.item;
    const startDate = new Date(ShiftData.startTime);
    const endDate = new Date(ShiftData.endTime);
    return(
        <TouchableOpacity style={{marginHorizontal:2, marginTop:5}} onPress={()=>setExpanded(!expanded)}>
            <View style={{flexDirection:"column"}}>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                        <Text>
                            {addZero(startDate.getHours())+":"+addZero(startDate.getMinutes())}
                        </Text>
                        <Text>
                            {startDate.getDate()+"/"+(startDate.getMonth()+1)+"/"+startDate.getFullYear()}
                        </Text>
                    </View>
                    <View style={{flex:1, flexDirection:"column", alignItems:"center"}}>
                        <Text>
                            {addZero(endDate.getHours())+":"+addZero(endDate.getMinutes())}
                        </Text>
                        <Text>
                            {endDate.getDate()+"/"+(endDate.getMonth()+1)+"/"+endDate.getFullYear()}
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
                <View style={{flex:2, flexDirection:"column", marginHorizontal:25, marginVertical:10}}>
                        {ShiftData.notes?
                        <Text>
                            {ShiftData.notes}
                        </Text>
                        :
                        <Text style={{fontStyle:"italic"}}>
                            No description
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