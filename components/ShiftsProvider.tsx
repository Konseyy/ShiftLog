import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
} from 'react';
import { shift, shiftToAdd } from '../types';
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
interface shiftsContext {
	shifts: shift[];
	modifyShifts: (action: actionAll) => Promise<void>;
	loading: boolean;
	refreshFromStorage: () => Promise<void>;
	overwriteFromBackup: (newShifts: shift[]) => Promise<void>;
}
const ShiftsContext = createContext<shiftsContext>({
	shifts: [],
	modifyShifts: (a) => {
		return new Promise((r) => r);
	},
	loading: true,
	refreshFromStorage: () => {
		return new Promise((r) => r);
	},
	overwriteFromBackup: (a) => {
		return new Promise((r) => r);
	},
});
const ShiftsProvider: FC = ({ children }) => {
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
	const saveShiftLogStorage = async (newData: shift[] = shiftList) => {
		const JSONShifts = JSON.stringify({
			shifts: newData,
		});
		setLoading(true);
		await AsyncStorage.setItem('savedShifts', JSONShifts).then(() =>
			setLoading(false)
		);
	};
	const reducer = async (action: actionAll) => {
		if (isAdd(action)) {
			shiftList.push({ ...action.value.data, index: shiftList.length });
			await saveShiftLogStorage();
		}
		if (isDelete(action)) {
			shiftList.splice(action.value.index, 1);
			shiftList.forEach((i, x) => (i.index = x));
			await saveShiftLogStorage();
		}
		if (isEdit(action)) {
			shiftList[action.value.data.index] = action.value.data;
			await saveShiftLogStorage();
		}
	};
	const overwriteFromBackup = async (newData: shift[]): Promise<void> => {
		setShiftList(newData);
		await saveShiftLogStorage();
	};
	useEffect(() => {
		refreshFromStorage();
	}, []);
	return (
		<ShiftsContext.Provider
			value={{
				shifts: shiftList,
				modifyShifts: reducer,
				loading,
				overwriteFromBackup,
				refreshFromStorage,
			}}
		>
			{children}
		</ShiftsContext.Provider>
	);
};
const useShifts = () => useContext(ShiftsContext);
export default useShifts;
export { ShiftsProvider };
