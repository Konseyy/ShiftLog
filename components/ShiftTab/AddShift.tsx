import React, { useEffect, useState, FC } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {
	stringDateFromDate,
	stringTimeFromDate,
} from '../../helperFunctions/dateFormatFunctions';
import useShiftList from '../../helperFunctions/useShiftList';
import { AddShiftProps } from '../../types';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
const AddShift: FC<AddShiftProps> = ({ navigation, route }) => {
	const params = route.params ?? {};
	const [startDate, setStartDate] = useState(
		params.current ? new Date(params.current.startTime) : new Date()
	);
	const [startTime, setStartTime] = useState(
		params.current ? new Date(params.current.startTime) : new Date()
	);
	const [endDate, setEndDate] = useState(
		params.current ? new Date(params.current.endTime) : new Date()
	);
	const [endTime, setEndDateTime] = useState(
		params.current ? new Date(params.current.endTime) : new Date()
	);
	const [showStartDateSelect, setShowStartDateSelect] = useState(false);
	const [showStartTimeSelect, setShowStartTimeSelect] = useState(false);
	const [showEndDateSelect, setShowEndDateSelect] = useState(false);
	const [showEndTimeSelect, setShowEndTimeSelect] = useState(false);
	const [breakTime, setBreakTime] = useState(
		params.current ? params.current.break : 0
	);
	const [notes, setNotes] = useState<string>(
		params.current ? params.current.notes : ''
	);
	const { modifyShifts } = useShiftList();
	function onSelect(
		event: Event,
		selectedDate: Date | undefined,
		dateSetter: (date: Date) => void,
		modalSetter: React.Dispatch<React.SetStateAction<boolean>>
	) {
		modalSetter(false);
		if (!selectedDate) {
			return;
		}
		dateSetter(selectedDate);
	}
	function dateCheck(start: number, end: number) {
		if (!(end > start)) {
			Alert.alert(
				'Invalid Dates',
				'Shift end time must be greater than shift start time'
			);
			return false;
		} else if (!(end - breakTime * 60 * 1000 > start)) {
			Alert.alert(
				'Shift Time Negative',
				'Change Start/End times or adjust break time'
			);
			return false;
		} else {
			return true;
		}
	}
	async function addShift() {
		let dateToAddStart = new Date(startDate);
		dateToAddStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
		let dateToAddEnd = new Date(endDate);
		dateToAddEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
		if (!dateCheck(dateToAddStart.getTime(), dateToAddEnd.getTime())) {
			console.error('this is a problem');
			return;
		}
		if (!params.current) {
			await modifyShifts({
				type: 'add',
				value: {
					data: {
						startTime: dateToAddStart.getTime(),
						endTime: dateToAddEnd.getTime(),
						break: breakTime,
						notes: notes,
					},
				},
			});
		} else {
			await modifyShifts({
				type: 'edit',
				value: {
					data: {
						startTime: dateToAddStart.getTime(),
						endTime: dateToAddEnd.getTime(),
						break: breakTime,
						notes: notes,
						index: params.current.index,
					},
				},
			});
		}

		navigation.navigate('ShiftList');
	}
	useEffect(() => {
		if (params.current) {
			navigation.setOptions({
				title: 'Edit Shift',
			});
		} else {
			navigation.setOptions({
				title: 'Add new Shift',
			});
		}
		console.log('params', params);
	}, []);
	return (
		<>
			<View style={{ flexDirection: 'column' }}>
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<View
						style={{
							marginHorizontal: 20,
							marginTop: 15,
							alignSelf: 'stretch',
						}}
					>
						<View style={{ flexDirection: 'column' }}>
							<Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
								Start of Shift
							</Text>
							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ flex: 1 }} />
								<TouchableOpacity
									style={{ flex: 2, alignItems: 'center' }}
									onPress={() => {
										softHaptic();
										setShowStartDateSelect(true);
									}}
								>
									<Text>{stringDateFromDate(startDate)}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{ flex: 2, alignItems: 'center' }}
									onPress={() => {
										softHaptic();
										setShowStartTimeSelect(true);
									}}
								>
									<Text>{stringTimeFromDate(startTime)}</Text>
								</TouchableOpacity>
								<View style={{ flex: 1 }} />
							</View>
						</View>
						<View style={{ flexDirection: 'column', marginVertical: 10 }}>
							<Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
								End of Shift
							</Text>
							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<View style={{ flex: 1 }} />
								<TouchableOpacity
									style={{ flex: 2, alignItems: 'center' }}
									onPress={() => {
										softHaptic();
										setShowEndDateSelect(true);
									}}
								>
									<Text>{stringDateFromDate(endDate)}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{ flex: 2, alignItems: 'center' }}
									onPress={() => {
										softHaptic();
										setShowEndTimeSelect(true);
									}}
								>
									<Text>{stringTimeFromDate(endTime)}</Text>
								</TouchableOpacity>
								<View style={{ flex: 1 }} />
							</View>
						</View>
						<View style={{ flexDirection: 'column', marginTop: 10 }}>
							<Text style={{ fontWeight: 'bold' }}>Break Time</Text>
							<Picker
								style={{ backgroundColor: 'white', marginTop: 10 }}
								selectedValue={breakTime}
								onValueChange={(value) => setBreakTime(value)}
							>
								<Picker.Item label="0m" value={0} />
								<Picker.Item label="15m" value={15} />
								<Picker.Item label="30m" value={30} />
								<Picker.Item label="45m" value={45} />
								<Picker.Item label="60m" value={60} />
							</Picker>
						</View>
						<View
							style={{
								marginTop: 20,
								marginBottom: 20,
								alignSelf: 'stretch',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Text style={{ fontWeight: 'bold', alignSelf: 'flex-start' }}>
								Additional notes
							</Text>
							<TextInput
								multiline={true}
								textAlignVertical="top"
								defaultValue={notes}
								style={{
									marginTop: 10,
									backgroundColor: '#FFFFFF',
									color: '#000000',
									alignSelf: 'stretch',
								}}
								onChangeText={(txt) => setNotes(txt)}
							/>
						</View>
					</View>
				</View>
			</View>
			{/* <Button title="Save" onPress={()=>addShift()}/> */}
			<TouchableOpacity
				onPress={() => addShift()}
				style={{
					position: 'absolute',
					right: 15,
					bottom: 15,
				}}
			>
				<View
					style={{
						backgroundColor: '#26a5ff',
						paddingVertical: 7,
						paddingHorizontal: 18,
						borderRadius: 8,
					}}
				>
					<Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
						Save
					</Text>
				</View>
			</TouchableOpacity>
			{showStartDateSelect && (
				<DateTimePicker
					mode="date"
					value={startDate}
					onChange={(e: Event, s: Date | undefined) =>
						onSelect(e, s, setStartDate, setShowStartDateSelect)
					}
				/>
			)}
			{showStartTimeSelect && (
				<DateTimePicker
					mode="time"
					value={startTime}
					onChange={(e: Event, s: Date | undefined) =>
						onSelect(e, s, setStartTime, setShowStartTimeSelect)
					}
				/>
			)}
			{showEndDateSelect && (
				<DateTimePicker
					mode="date"
					value={endDate}
					onChange={(e: Event, s: Date | undefined) =>
						onSelect(e, s, setEndDate, setShowEndDateSelect)
					}
				/>
			)}
			{showEndTimeSelect && (
				<DateTimePicker
					mode="time"
					value={endTime}
					onChange={(e: Event, s: Date | undefined) =>
						onSelect(e, s, setEndDateTime, setShowEndTimeSelect)
					}
				/>
			)}
		</>
	);
};
export default AddShift;
