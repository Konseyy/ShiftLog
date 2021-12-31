import React, { FC } from 'react';
import { Alert, Button, View } from 'react-native';
import { DataOptionsProps } from '../../types';
import {pickSingle} from "react-native-document-picker";
import useShiftList from '../../helperFunctions/useShiftList';
import { shift } from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
const DataOptions: FC<DataOptionsProps> = ({ navigation }) => {
	const {overwriteFromBackup} = useShiftList();
	const goToReport = (): void => {
		navigation.navigate('MakeReport');
	};
	const goToBackup = (): void => {
		navigation.navigate('MakeBackup');
	};
	const importBackup = async (): Promise<void> => {
		const isDataRightType = (data:any):data is shift[] => {
			if(Array.isArray(data)){
				if(data[0]){
					let isCorrect = true;
					data.forEach((item)=>{
						if(item.startTime===undefined || item.endTime===undefined || item.break===undefined || item.index===undefined || item.notes===undefined){
							isCorrect=false;
							console.warn("incorrect item",item);
						}
						else{
							if(typeof(item.startTime)!=="number" || typeof(item.endTime)!=="number" || typeof(item.break)!=="number" || typeof(item.notes)!=="string"){
								console.warn("incorrect item format");
								isCorrect=false;
							}
						}
					})
					return isCorrect;
				}
			}
			return false;
		}
		const resp = await pickSingle();
		if(resp.type!=="text/plain"){
			Alert.alert("Wrong file format","Backup should be a .txt file");
			return;
		}
		try{
			const backupFile = await RNFetchBlob.fs.readFile(resp.uri,"utf8");
			let readData = JSON.parse(backupFile);
			if(!isDataRightType(readData)){
				Alert.alert("Incorrect data","Backup file contains incorrect data format");
				return;
			}
			await overwriteFromBackup(readData);
			Alert.alert("Backup restored", "Backup successfully restored");
		}
		catch(err){
			console.error("error reading backup", err)
		}
	}
	return (
		<View>
			<Button color="green" title={'Generate report'} onPress={goToReport} />
			<Button color="darkgray" title={'Create backup'} onPress={goToBackup} />
			<Button color="gray" title={'Import backup'} onPress={importBackup} />
		</View>
	);
};
export default DataOptions;
