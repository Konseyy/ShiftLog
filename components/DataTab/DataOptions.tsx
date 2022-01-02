import React, { FC } from 'react';
import {
	Alert,
	TouchableOpacity,
	View,
	Text,
	ViewStyle,
	Image,
	ImageSourcePropType,
	PermissionsAndroid,
} from 'react-native';
import { DataOptionsProps } from '../../types';
import { pickSingle, isCancel } from 'react-native-document-picker';
import { shift } from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import useShifts from '../ShiftsProvider';
const DataOptions: FC<DataOptionsProps> = ({ navigation }) => {
	const { overwriteFromBackup } = useShifts();
	const goToReport = (): void => {
		navigation.navigate('ExportFile', { action: 'report' });
	};
	const goToBackup = (): void => {
		navigation.navigate('ExportFile', { action: 'backup' });
	};
	const importBackup = async (): Promise<void> => {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
		} else {
			Alert.alert(
				'Permission required',
				'Permission to read files is required in order to read the Backup'
			);
		}
	};
	const ListItem: React.FC<{
		pressAction: () => void;
		title: string;
		style?: ViewStyle;
		color?: string;
		textColor?: string;
		imgPath?: ImageSourcePropType;
	}> = ({ pressAction, title, style, color, textColor, imgPath }) => {
		return (
			<View style={{ marginBottom: 10, marginHorizontal: 15, ...style }}>
				<TouchableOpacity
					onPress={() => {
						softHaptic();
						pressAction();
					}}
					style={{
						backgroundColor: color,
						padding: 10,
						borderRadius: 10,
						flexDirection: 'row',
					}}
				>
					<Text
						style={{
							flex: 1,
							fontSize: 20,
							color: textColor ?? 'white',
							fontWeight: 'bold',
							marginLeft: 3,
							letterSpacing: 0.2,
						}}
					>
						{title}
					</Text>
					{imgPath && (
						<Image
							style={{
								marginRight: 5,
								alignSelf: 'center',
								height: 25,
								width: 25,
								tintColor: 'white',
							}}
							source={imgPath}
						/>
					)}
				</TouchableOpacity>
			</View>
		);
	};
	return (
		<View style={{ flexDirection: 'column' }}>
			<ListItem
				style={{ marginTop: 10 }}
				color="green"
				title="New Report"
				pressAction={goToReport}
				imgPath={require('../../img/icons-report.png')}
			/>
			<ListItem
				color="gray"
				title="Create Backup"
				pressAction={goToBackup}
				imgPath={require('../../img/icons-backup.png')}
			/>
			<ListItem
				color="darkgray"
				title="Import Backup"
				pressAction={importBackup}
				imgPath={require('../../img/icons-restore-backup.png')}
			/>
		</View>
	);
};
export default DataOptions;
