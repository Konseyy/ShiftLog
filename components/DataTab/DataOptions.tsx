import React, { FC } from 'react';
import { Alert, TouchableOpacity, View, Text, ViewStyle } from 'react-native';
import { DataOptionsProps } from '../../types';
import { pickSingle, isCancel } from 'react-native-document-picker';
import useShiftList from '../../helperFunctions/useShiftList';
import { shift } from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
const DataOptions: FC<DataOptionsProps> = ({ navigation }) => {
	const { overwriteFromBackup } = useShiftList();
	const goToReport = (): void => {
		navigation.navigate('ExportFile', {action:"report"});
	};
	const goToBackup = (): void => {
		navigation.navigate('ExportFile', {action:"backup"});
	};
	const importBackup = async (): Promise<void> => {
		const isDataRightType = (data: any): data is shift[] => {
			if (Array.isArray(data)) {
				if (data[0]) {
					let isCorrect = true;
					data.forEach((item) => {
						if (
							item.startTime === undefined ||
							item.endTime === undefined ||
							item.break === undefined ||
							item.index === undefined ||
							item.notes === undefined
						) {
							isCorrect = false;
							console.warn('incorrect item', item);
						} else {
							if (
								typeof item.startTime !== 'number' ||
								typeof item.endTime !== 'number' ||
								typeof item.break !== 'number' ||
								typeof item.notes !== 'string'
							) {
								console.warn('incorrect item format');
								isCorrect = false;
							}
						}
					});
					return isCorrect;
				}
			}
			return false;
		};
		try {
			const resp = await pickSingle();
			if (!resp) return;
			if (resp.type !== 'text/plain') {
				Alert.alert('Wrong file format', 'Backup should be a .txt file');
				return;
			}
			const backupFile = await RNFetchBlob.fs.readFile(resp.uri, 'utf8');
			let readData = JSON.parse(backupFile);
			if (!isDataRightType(readData)) {
				Alert.alert(
					'Incorrect data',
					'Backup file contains incorrect data format'
				);
				return;
			}
			await overwriteFromBackup(readData);
			Alert.alert('Backup restored', 'Backup successfully restored');
		} catch (err) {
			if (isCancel(err)) {
				return;
			}
			console.error('error reading backup', err);
		}
	};
	const ListItem: React.FC<{
		pressAction: () => void;
		title: string;
		style?: ViewStyle;
		color?: string;
		textColor?: string;
	}> = ({ pressAction, title, style, color, textColor }) => {
		return (
			<View style={{ marginBottom: 10, marginHorizontal: 15, ...style }}>
				<TouchableOpacity
					onPress={() => {
						softHaptic();
						pressAction();
					}}
					style={{ backgroundColor: color, padding: 10, borderRadius: 10 }}
				>
					<Text
						style={{
							fontSize: 20,
							color: textColor ?? 'white',
							fontWeight: 'bold',
							marginLeft: 3,
						}}
					>
						{title}
					</Text>
				</TouchableOpacity>
			</View>
		);
	};
	return (
		<View style={{ flexDirection: 'column' }}>
			<ListItem
				style={{ marginTop: 10 }}
				color="green"
				title="Generate report"
				pressAction={goToReport}
			/>
			<ListItem color="gray" title="Create backup" pressAction={goToBackup} />
			<ListItem
				color="darkgray"
				title="Import backup"
				pressAction={importBackup}
			/>
		</View>
	);
};
export default DataOptions;
