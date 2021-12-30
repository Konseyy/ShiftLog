import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reducerShift, shift} from '../components/types/shifts';

const useShiftList = () => {
  type actionTypeAdd = {
    type: 'add';
    value: {
      data: reducerShift;
    };
  };
  type actionTypeDelete = {
    type: 'delete';
    value: {
      index: number;
    };
  };
  type actionTypeEdit = {
    type: 'edit';
    value: {
      data: shift;
    };
  };
  type actionAll = actionTypeAdd | actionTypeDelete | actionTypeEdit;
  const isAdd = (action: actionAll): action is actionTypeAdd => {
    return action.type === 'add';
  };
  const isDelete = (action: actionAll): action is actionTypeDelete => {
    return action.type === 'add';
  };
  const isEdit = (action: actionAll): action is actionTypeEdit => {
    return action.type === 'add';
  };
  const [shiftList, setShiftList] = useState<shift[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
	  console.log("list updated",shiftList)
  },[shiftList])
  const refreshFromStorage = async () => {
    console.log('before ref', shiftList.length);
    const savedShiftsRetrieved = await AsyncStorage.getItem('savedShifts');
    setLoading(false);
    if (savedShiftsRetrieved) {
      const convertedShifts = JSON.parse(savedShiftsRetrieved);
      setShiftList(convertedShifts.shifts);
    } else {
      const defaultStorage = {
        shifts: [],
      };
      await AsyncStorage.setItem('savedShifts', JSON.stringify(defaultStorage));
    }
  };
  console.log('after ref', shiftList.length);
  const saveShiftLogStorage = async () => {
    const JSONShifts = JSON.stringify({
      shifts: shiftList,
    });
    setLoading(true);
    await AsyncStorage.setItem('savedShifts', JSONShifts).then(() =>
      setLoading(false),
    );
  };
  const reducer = async (action: actionAll) => {
    if (isAdd(action)) {
      console.log('new one', action.value);
      await refreshFromStorage();
      shiftList.push({...action.value.data, index: shiftList.length});
      await saveShiftLogStorage();
    }
    if (isDelete(action)) {
      shiftList.splice(action.value.index, 1);
      await saveShiftLogStorage();
    }
    if (isEdit(action)) {
      shiftList[action.value.data.index] = action.value.data;
      await saveShiftLogStorage();
    }
  };
  useEffect(() => {
    refreshFromStorage();
  }, []);
  return {
    shifts: shiftList,
    modifyShifts: reducer,
    loading,
    refreshFromStorage,
  };
};
export default useShiftList;
