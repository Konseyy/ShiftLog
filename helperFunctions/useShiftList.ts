import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shiftToAdd, shift } from '../types';

const useShiftList = () => {
	type actionTypeAdd = {
		type: 'add';
		value: {
			data: shiftToAdd;
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
		return action.type === 'delete';
	};
	const isEdit = (action: actionAll): action is actionTypeEdit => {
		return action.type === 'edit';
	};
	const [shiftList, setShiftList] = useState<shift[]>([]);
	const [loading, setLoading] = useState(true);
	const refreshFromStorage = async () => {
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
	const saveShiftLogStorage = async () => {
		const JSONShifts = JSON.stringify({
			shifts: shiftList,
		});
		setLoading(true);
		await AsyncStorage.setItem('savedShifts', JSONShifts).then(() =>
			setLoading(false)
		);
	};
	const reducer = async (action: actionAll) => {
		if (isAdd(action)) {
			await refreshFromStorage();
			shiftList.push({ ...action.value.data, index: shiftList.length });
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
	const overwriteFromBackup = async (newData:shift[]): Promise<void> => {
		setShiftList(newData);
		await saveShiftLogStorage();
	}
	useEffect(() => {
		refreshFromStorage();
	}, []);
	return {
		shifts: shiftList,
		modifyShifts: reducer,
		loading,
		refreshFromStorage,
		overwriteFromBackup
	};
};
export default useShiftList;
