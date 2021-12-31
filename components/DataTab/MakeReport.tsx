import React, { FC, useState } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	PermissionsAndroid,
	Alert,
} from 'react-native';
import useShiftList from '../../helperFunctions/useShiftList';
import {
	dateDifference,
	stringDateFromDate,
	stringTimeFromDate,
} from '../../helperFunctions/dateFormatFunctions';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import RNFetchBlob from 'rn-fetch-blob';
import { MakeReportProps, shift } from '../../types';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
const MakeReport: FC<MakeReportProps> = () => {
	const [periodFilter, setPeriodFilter] = useState<'all' | 'custom'>('all');
	const [startPickerVisible, setStartPickerVisible] = useState(false);
	const [enddPickerVisible, setEndPickerVisible] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const { shifts, refreshFromStorage } = useShiftList();
	const generateReport = async (): Promise<void> => {
		await refreshFromStorage();
		const today = new Date();
		const fileName =
			`Report-ShiftLog-${today.toLocaleDateString()}-${today.getTime()}`.replace(
				/\//g,
				'-'
			);
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
		let saveString =
			'Start Date, Start Time, End Date, End Time, Duration, Notes\n';
		shiftsInReport.forEach((shift) => {
			let line = `${stringDateFromDate(
				new Date(shift.startTime)
			)}, ${stringTimeFromDate(
				new Date(shift.startTime)
			)}, ${stringDateFromDate(new Date(shift.endTime))}, ${stringTimeFromDate(
				new Date(shift.endTime)
			)}, ${dateDifference(shift.startTime, shift.endTime, shift.break)},${
				shift.notes
			}\n`;
			saveString += line;
		});

		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				const dirs = RNFetchBlob.fs.dirs;
				console.log(dirs);
				const fs = RNFetchBlob.fs;
				const NEW_FILE_PATH = `${dirs.DownloadDir}/${fileName}.txt`;
				console.log('dir', NEW_FILE_PATH);
				await fs.createFile(NEW_FILE_PATH, saveString, 'utf8');
				Alert.alert(
					'Report generated',
					`Report has been downloaded to \n ${NEW_FILE_PATH}`
				);
				// RNFetchBlob.android.actionViewIntent(NEW_FILE_PATH, 'text/plain');
			} else {
				Alert.alert(
					'Permission required',
					'Permission to store files is required in order to store the report'
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
						<Text style={{ fontSize: 15, fontWeight: 'bold' }}>
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
									backgroundColor: periodFilter === 'all' ? 'gray' : 'darkgray',
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
										periodFilter === 'custom' ? 'gray' : 'darkgray',
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
								}}
							>
								Select start date:
							</Text>
							<View style={{ flex: 2, alignItems: 'flex-start' }}>
								<TouchableOpacity
									style={{
										backgroundColor: 'lightgray',
										padding: 8,
										borderRadius: 10,
									}}
									onPress={() => {
										softHaptic();
										setStartPickerVisible(true);
									}}
								>
									<Text style={{ fontWeight: 'bold' }}>
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
								}}
							>
								Select end date:
							</Text>
							<View style={{ flex: 2, alignItems: 'flex-start' }}>
								<TouchableOpacity
									style={{
										backgroundColor: 'lightgray',
										padding: 8,
										borderRadius: 10,
									}}
									onPress={() => {
										softHaptic();
										setEndPickerVisible(true);
									}}
								>
									<Text style={{ fontWeight: 'bold' }}>
										{stringDateFromDate(endDate)}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			</View>

			<View style={{ marginTop: 10 }}>
				<Text>
					This action will generate a report file containing all locally saved
					data in your selected period
				</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginTop: '20%',
				}}
			>
				<TouchableOpacity
					style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}
					onPress={() => {
						softHaptic();
						generateReport();
					}}
				>
					<View>
						<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
							Generate Report
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
export default MakeReport;
