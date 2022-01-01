import React, { FC, useEffect, useState } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	PermissionsAndroid,
	Alert,
} from 'react-native';
import {
	dateDifference,
	displayHoursAndMinutes,
	getShiftDurationInMinutes,
	stringDateFromDate,
	stringTimeFromDate,
} from '../../helperFunctions/dateFormatFunctions';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import RNFetchBlob from 'rn-fetch-blob';
import { ExportFileProps, shift, exportScreenTypes } from '../../types';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import useColors from '../../helperFunctions/useColors';
import useShifts from '../ShiftsProvider';
const ExportFile: FC<ExportFileProps> = ({ navigation, route }) => {
	const colors = useColors();
	const [periodFilter, setPeriodFilter] = useState<'all' | 'custom'>('all');
	const [startPickerVisible, setStartPickerVisible] = useState(false);
	const [enddPickerVisible, setEndPickerVisible] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [actionState, setActionState] = useState<exportScreenTypes>('backup');
	const [description, setDescription] = useState('');
	const [buttonText, setButtonText] = useState('');
	const { shifts, refreshFromStorage } = useShifts();
	useEffect(() => {
		if (route.params.action === 'backup') {
			navigation.setOptions({
				title: 'Create Backup',
			});
			setActionState('backup');
			setDescription(
				'This action will generate a backup file containing all locally saved data in your selected period'
			);
			setButtonText('Create Backup');
		} else if (route.params.action === 'report') {
			navigation.setOptions({
				title: 'New Report',
			});
			setActionState('report');
			setDescription(
				'This action will generate a report file containing all locally saved data in your selected period'
			);
			setButtonText('Generate Report');
		}
	}, []);
	const generateReport = async (): Promise<void> => {
		await refreshFromStorage();
		const today = new Date();
		const fileName =
			actionState === 'report'
				? `Report-ShiftLog-${today.toLocaleDateString()}-${today.getTime()}`.replace(
						/\//g,
						'-'
				  )
				: `ShiftLogBackup-${today.toLocaleDateString()}-${today.getTime()}`.replace(
						/\//g,
						'-'
				  );
		let saveString = '';
		if (actionState === 'report') {
			let shiftsInReport: shift[] = [];
			if (periodFilter === 'all') {
				shiftsInReport = shifts;
			} else if (periodFilter === 'custom') {
				let startTime = startDate.setHours(0, 0, 0, 0);
				let tempEndDate = new Date(endDate);
				tempEndDate.setDate(tempEndDate.getDate() + 1);
				tempEndDate.setHours(0, 0, 0, 0);
				tempEndDate.setMilliseconds(tempEndDate.getMilliseconds() - 1);
				let endTime = tempEndDate.getTime();
				shiftsInReport = shifts.filter((shift) => {
					return shift.startTime >= startTime && shift.startTime <= endTime;
				});
			}
			saveString =
				'Start Date, Start Time, End Date, End Time, Duration, Notes, Total time\n';
			let minutes = 0;
			shiftsInReport.forEach((shiftObject) => {
				minutes += getShiftDurationInMinutes(shiftObject);
			});
			const totalTime = displayHoursAndMinutes(minutes);
			shiftsInReport.forEach((shift, lineNumber) => {
				let line = `${stringDateFromDate(
					new Date(shift.startTime)
				)}, ${stringTimeFromDate(
					new Date(shift.startTime)
				)}, ${stringDateFromDate(
					new Date(shift.endTime)
				)}, ${stringTimeFromDate(new Date(shift.endTime))}, ${dateDifference(
					shift.startTime,
					shift.endTime,
					shift.break
				)},${shift.notes.length ? shift.notes : ''}${
					lineNumber === 0 ? ',' + totalTime : ''
				}\n`;
				saveString += line;
			});
		} else if (actionState === 'backup') {
			if (periodFilter === 'all') {
				saveString = JSON.stringify(shifts);
			} else if (periodFilter === 'custom') {
				let startTime = startDate.setHours(0, 0, 0, 0);
				let tempEndDate = new Date(endDate);
				tempEndDate.setDate(tempEndDate.getDate() + 1);
				tempEndDate.setHours(0, 0, 0, 0);
				tempEndDate.setMilliseconds(tempEndDate.getMilliseconds() - 1);
				let endTime = tempEndDate.getTime();
				saveString = JSON.stringify(
					shifts.filter((shift) => {
						return shift.startTime >= startTime && shift.startTime <= endTime;
					})
				);
			}
		}

		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				const dirs = RNFetchBlob.fs.dirs;
				const fs = RNFetchBlob.fs;
				const NEW_FILE_PATH =
					actionState === 'report'
						? `${dirs.DownloadDir}/${fileName}.csv`
						: `${dirs.DownloadDir}/${fileName}.txt`;
				await fs.createFile(NEW_FILE_PATH, saveString, 'utf8');
				Alert.alert(
					actionState === 'report' ? 'Report generated' : 'Backup created',
					actionState === 'report'
						? `Report has been downloaded to \n ${NEW_FILE_PATH}`
						: `Backup has been downloaded to \n ${NEW_FILE_PATH}`
				);
				// RNFetchBlob.android.actionViewIntent(NEW_FILE_PATH, 'text/plain');
			} else {
				Alert.alert(
					'Permission required',
					actionState === 'report'
						? 'Permission to store files is required in order to store the Report'
						: 'Permission to store files is required in order to store the Backup'
				);
				console.warn('Permission denied');
			}
		} catch (err) {
			console.error('error saving file', err);
		}
	};
	return (
		<View
			style={{ flexDirection: 'column', marginHorizontal: 20, marginTop: 15 }}
		>
			<View
				style={{
					flexDirection: 'column',
					borderBottomColor: 'lightgray',
					borderBottomWidth: 0.5,
					paddingBottom: 10,
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ flex: 2 }}>
						<Text
							style={{
								fontSize: 15,
								fontWeight: 'bold',
								color: colors.textColor,
							}}
						>
							Select Period :
						</Text>
					</View>
					<View style={{ flexDirection: 'row', flex: 5 }}>
						<TouchableOpacity
							style={{ flex: 1 }}
							onPress={() => {
								softHaptic();
								setPeriodFilter('all');
							}}
						>
							<View
								style={{
									backgroundColor:
										periodFilter === 'all'
											? colors.selectedBackground
											: colors.notSelectedBackground,
									padding: 8,
									borderRadius: 5,
									alignSelf: 'center',
								}}
							>
								<Text style={{ fontWeight: 'bold', color: 'white' }}>
									All Data
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ alignSelf: 'flex-end', flex: 1 }}
							onPress={() => {
								softHaptic();
								setPeriodFilter('custom');
							}}
						>
							<View
								style={{
									backgroundColor:
										periodFilter === 'custom'
											? colors.selectedBackground
											: colors.notSelectedBackground,
									padding: 8,
									borderRadius: 5,
									alignSelf: 'center',
								}}
							>
								<Text
									style={{
										alignSelf: 'center',
										fontWeight: 'bold',
										color: 'white',
									}}
								>
									Custom Period
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				{periodFilter === 'custom' && (
					<View
						style={{
							flexDirection: 'column',
							marginTop: 15,
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								marginBottom: 10,
								alignItems: 'center',
							}}
						>
							<Text
								style={{
									flex: 1,
									fontSize: 15,
									fontWeight: 'bold',
									minWidth: 20,
									color: colors.textColor,
								}}
							>
								Select start date:
							</Text>
							<View style={{ flex: 2, alignItems: 'flex-start' }}>
								<TouchableOpacity
									style={{
										backgroundColor: colors.dateSelectBackground,
										padding: 8,
										borderRadius: 10,
									}}
									onPress={() => {
										softHaptic();
										setStartPickerVisible(true);
									}}
								>
									<Text style={{ fontWeight: 'bold', color: colors.textColor }}>
										{stringDateFromDate(startDate)}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={{
									flex: 1,
									fontSize: 15,
									fontWeight: 'bold',
									minWidth: 20,
									color: colors.textColor,
								}}
							>
								Select end date:
							</Text>
							<View style={{ flex: 2, alignItems: 'flex-start' }}>
								<TouchableOpacity
									style={{
										backgroundColor: colors.dateSelectBackground,
										padding: 8,
										borderRadius: 10,
									}}
									onPress={() => {
										softHaptic();
										setEndPickerVisible(true);
									}}
								>
									<Text style={{ fontWeight: 'bold', color: colors.textColor }}>
										{stringDateFromDate(endDate)}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			</View>

			<View style={{ marginTop: 10 }}>
				<Text style={{ color: colors.textColor }}>{description}</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginTop: '5%',
				}}
			>
				<TouchableOpacity
					style={{
						backgroundColor:
							actionState === 'report' ? colors.buttonGreen : colors.buttonBlue,
						padding: 10,
						borderRadius: 10,
					}}
					onPress={() => {
						softHaptic();
						generateReport();
					}}
				>
					<View>
						<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
							{buttonText}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			{startPickerVisible && (
				<DateTimePicker
					mode="date"
					value={startDate}
					onChange={(e: Event, s: Date | undefined) => {
						softHaptic();
						setStartPickerVisible(false);
						if (s) {
							setStartDate(s);
						}
					}}
				/>
			)}
			{enddPickerVisible && (
				<DateTimePicker
					mode="date"
					value={startDate}
					onChange={(e: Event, s: Date | undefined) => {
						softHaptic();
						setEndPickerVisible(false);
						if (s) {
							setEndDate(s);
						}
					}}
				/>
			)}
		</View>
	);
};
export default ExportFile;
