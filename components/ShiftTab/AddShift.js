import React, { useEffect } from "react";
import { View, Text } from "react-native";
const AddShift = ({navigation, route}) => {
  const {params} = route;
  useEffect(()=>{
    console.log("parm",params);
  },[]);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Add Shift Screen</Text>
          <Text>First is {params.shiftList[0]}</Text>

        </View>
    );
}
export default AddShift;