import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useShiftList = () => {
    const [shiftList, setShiftList] = useState([]);
    const [loading, setLoading]= useState(true);
    const refreshFromStorage = async () => {
        const savedShiftsRetrieved = await AsyncStorage.getItem("savedShifts");
        setLoading(false);
        if(savedShiftsRetrieved){
          const convertedShifts = JSON.parse(savedShiftsRetrieved);
          setShiftList(convertedShifts.shifts);
        }
        else{
          const defaultStorage = {
            shifts:[],
          };
          await AsyncStorage.setItem("savedShifts",JSON.stringify(defaultStorage));
        }}
    const saveShiftLogStorage = async () => {
        const JSONShifts = JSON.stringify({
          shifts: shiftList,
        });
        setLoading(true);
        await AsyncStorage.setItem("savedShifts",JSONShifts).then(()=>setLoading(false));
    }
    const reducer = async ({type, value}) => {
        switch(type){
            case "add":
                console.log("new one",value)
                shiftList.push(value.data);
                await saveShiftLogStorage();
                break;
            case "delete":
                shiftList.splice(value.index,1)
                await saveShiftLogStorage();
                break;
            case "edit":
                shiftList[value.index] = value.data;
                await saveShiftLogStorage();
                break;
            default:
                break;
        }
    }
    useEffect(()=>{
        refreshFromStorage();
    },[]);
    return{shifts:shiftList,modifyShifts:reducer,loading,refreshFromStorage}
}
export default useShiftList;