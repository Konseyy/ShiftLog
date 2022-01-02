import React, { useEffect, useState, FC } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import {
	stringDateFromDate,
	stringTimeFromDate,
} from '../../helperFunctions/dateFormatFunctions';
import { AddShiftProps } from '../../types';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import useColors from '../../helperFunctions/useColors';
import useShifts from '../ShiftsProvider';
import CircleButton from '../circleButton';
const AddShift: FC<AddShiftProps> = ({ navigation, route }) => {
	const colors = useColors();
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
	const [customBreakTime, setCustomBreakTime] = useState(0);
	const [showStartDateSelect, setShowStartDateSelect] = useState(false);
	const [showStartTimeSelect, setShowStartTimeSelect] = useState(false);
	const [showEndDateSelect, setShowEndDateSelect] = useState(false);
	const [showEndTimeSelect, setShowEndTimeSelect] = useState(false);
	const [showCustomBreakInput, setShowCustomBreakInput] = useState(false);
	const [breakTime, setBreakTime] = useState(
		params.current ? params.current.break : 0
	);
	const [notes, setNotes] = useState<string>(
		params.current ? params.current.notes : ''
	);
	const { modifyShifts } = useShifts();
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
		}
		if (showCustomBreakInput) {
			if (!(end - customBreakTime * 60 * 1000 > start)) {
				Alert.alert(
					'Shift Time Negative',
					'Change Start/End times or adjust break time'
				);
				return false;
			}
		} else {
			if (!(end - breakTime * 60 * 1000 > start)) {
				Alert.alert(
					'Shift Time Negative',
					'Change Start/End times or adjust break time'
				);
				return false;
			}
		}
		return true;
	}
	async function addShift() {
		let dateToAddStart = new Date(startDate);
		dateToAddStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
		let dateToAddEnd = new Date(endDate);
		dateToAddEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
		if (!dateCheck(dateToAddStart.getTime(), dateToAddEnd.getTime())) {
			return;
		}
		if (!params.current) {
			await modifyShifts({
				type: 'add',
				value: {
					data: {
						startTime: dateToAddStart.getTime(),
						endTime: dateToAddEnd.getTime(),
						break: showCustomBreakInput ? customBreakTime : breakTime,
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
						break: showCustomBreakInput ? customBreakTime : breakTime,
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
		let temp = params.current?.break;
		if (
			temp !== 60 &&
			temp !== 45 &&
			temp !== 30 &&
			temp !== 15 &&
			temp !== 0 &&
			temp
		) {
			setBreakTime(-1);
			setShowCustomBreakInput(true);
			setCustomBreakTime(temp);
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
						<View style={{ flexDirection: 'column', marginBottom: 15 }}>
							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<Text
									style={{
										flex: 1,
										alignSelf: 'center',
										fontWeight: 'bold',
										fontSize: 15,
										minWidth: 30,
										color: colors.textColor,
									}}
								>
									Start of Shift
								</Text>
								<View style={{ flex: 2, alignItems: 'center' }}>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											backgroundColor: colors.dateSelectBackground,
											padding: 8,
											borderRadius: 10,
											width: 100,
										}}
										onPress={() => {
											softHaptic();
											setShowStartDateSelect(true);
										}}
									>
										<Text style={{ fontSize: 15, color: colors.textColor }}>
											{stringDateFromDate(startDate)}
										</Text>
									</TouchableOpacity>
								</View>
								<View style={{ flex: 2, alignItems: 'center' }}>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											backgroundColor: colors.dateSelectBackground,
											padding: 8,
											borderRadius: 10,
											width: 100,
										}}
										onPress={() => {
											softHaptic();
											setShowStartTimeSelect(true);
										}}
									>
										<Text style={{ color: colors.textColor }}>
											{stringTimeFromDate(startTime)}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<View
							style={{
								flexDirection: 'column',
								borderBottomWidth: 0.5,
								borderBottomColor: colors.seperatorColor,
								paddingBottom: 15,
							}}
						>
							<View style={{ flexDirection: 'row', marginTop: 10 }}>
								<Text
									style={{
										flex: 1,
										alignSelf: 'center',
										fontWeight: 'bold',
										fontSize: 15,
										minWidth: 30,
										color: colors.textColor,
									}}
								>
									End of Shift
								</Text>
								<View style={{ flex: 2, alignItems: 'center' }}>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											backgroundColor: colors.dateSelectBackground,
											padding: 8,
											borderRadius: 10,
											width: 100,
										}}
										onPress={() => {
											softHaptic();
											setShowEndDateSelect(true);
										}}
									>
										<Text style={{ fontSize: 15, color: colors.textColor }}>
											{stringDateFromDate(endDate)}
										</Text>
									</TouchableOpacity>
								</View>
								<View style={{ flex: 2, alignItems: 'center' }}>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											backgroundColor: colors.dateSelectBackground,
											padding: 8,
											borderRadius: 10,
											width: 100,
										}}
										onPress={() => {
											softHaptic();
											setShowEndTimeSelect(true);
										}}
									>
										<Text style={{ color: colors.textColor }}>
											{stringTimeFromDate(endTime)}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<View style={{ flexDirection: 'column', marginTop: 10 }}>
							<Text style={{ fontWeight: 'bold', color: colors.textColor }}>
								Break Time
							</Text>
							<Picker
								mode="dropdown"
								style={{ backgroundColor: 'white', marginTop: 10 }}
								selectedValue={breakTime}
								onValueChange={(value) => {
									softHaptic();
									if (value === -1) {
										setShowCustomBreakInput(true);
									} else {
										setShowCustomBreakInput(false);
									}
									setBreakTime(value);
								}}
							>
								<Picker.Item label="0m" value={0} />
								<Picker.Item label="15m" value={15} />
								<Picker.Item label="30m" value={30} />
								<Picker.Item label="45m" value={45} />
								<Picker.Item label="60m" value={60} />
								<Picker.Item label="other" value={-1} />
							</Picker>
						</View>
						{showCustomBreakInput && (
							<View style={{ flexDirection: 'column', marginTop: 10 }}>
								<Text style={{ fontWeight: 'bold', color: colors.textColor }}>
									Enter custom Break Time (minutes) :{' '}
								</Text>
								<TextInput
									selectTextOnFocus={true}
									style={{
										marginTop: 10,
										paddingLeft: 10,
										backgroundColor: '#FFFFFF',
										color: '#000000',
										alignSelf: 'stretch',
										borderRadius:5,
										fontSize:15
									}}
									keyboardType="numeric"
									placeholder="0"
									defaultValue={customBreakTime.toString()}
									onChangeText={(val) => {
										let noSymbols = val.toString().replace(/[^0-9]/g, '');
										setCustomBreakTime(
											noSymbols.length ? parseInt(noSymbols) : 0
										);
									}}
								/>
							</View>
						)}
						<View
							style={{
								marginTop: 20,
								marginBottom: 20,
								alignSelf: 'stretch',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Text
								style={{
									fontWeight: 'bold',
									alignSelf: 'flex-start',
									color: colors.textColor,
								}}
							>
								Additional notes
							</Text>
							<TextInput
								multiline={true}
								textAlignVertical="top"
								defaultValue={notes}
								style={{
									marginTop: 10,
									paddingHorizontal: 10,
									backgroundColor: '#FFFFFF',
									color: '#000000',
									alignSelf: 'stretch',
									borderRadius:5
								}}
								onChangeText={(txt) => setNotes(txt)}
							/>
						</View>
					</View>
				</View>
			</View>
			<CircleButton
				backgroundColor={colors.buttonBlue}
				onPress={addShift}
				height={60}
				centerElement={
					<Image
						style={{
							tintColor: 'white',
							position: 'absolute',
							alignSelf: 'center',
							height: 30,
							width: 30,
						}}
						source={require('../../img/icons-checkmark.png')}
					/>
				}
			/>
			{showStartDateSelect && (
				<DateTimePicker
					mode="date"
					value={startDate}
					onChange={(e: Event, s: Date | undefined) => {
						if (!s) {
							setShowStartDateSelect(false);
							return;
						}
						softHaptic();
						onSelect(e, s, setStartDate, setShowStartDateSelect);
						if (s > endDate) setEndDate(s);
					}}
				/>
			)}
			{showStartTimeSelect && (
				<DateTimePicker
					mode="time"
					value={startTime}
					onChange={(e: Event, s: Date | undefined) => {
						softHaptic();
						onSelect(e, s, setStartTime, setShowStartTimeSelect);
					}}
				/>
			)}
			{showEndDateSelect && (
				<DateTimePicker
					mode="date"
					value={endDate}
					onChange={(e: Event, s: Date | undefined) => {
						if (!s) {
							setShowEndDateSelect(false);
							return;
						}
						softHaptic();
						onSelect(e, s, setEndDate, setShowEndDateSelect);
						if (s < startDate) setStartDate(s);
					}}
				/>
			)}
			{showEndTimeSelect && (
				<DateTimePicker
					mode="time"
					value={endTime}
					onChange={(e: Event, s: Date | undefined) => {
						softHaptic();
						onSelect(e, s, setEndDateTime, setShowEndTimeSelect);
					}}
				/>
			)}
		</>
	);
};
export default AddShift;
