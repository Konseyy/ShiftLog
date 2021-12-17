import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
const ShiftItem = (item,navigation) => {
    const [expanded,setExpanded] = useState(false);
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
    useEffect(()=>{
        console.log("current item is",item.item.item);
    },[])
    useEffect(()=>{
        console.log("expanded",expanded)
    },[expanded]);
    const ShiftData = item.item.item;
    const startDate = new Date(ShiftData.startTime);
    const endDate = new Date(ShiftData.endTime);
    return(
        <TouchableOpacity style={{marginHorizontal:2, marginTop:5}} onPress={()=>{setExpanded(!expanded)}}>
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
                <View style={{flex:2, flexDirection:"column", marginHorizontal:5}}>
                    <Text>
                        {ShiftData.notes}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}
export default ShiftItem;