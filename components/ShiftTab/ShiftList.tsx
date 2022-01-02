import React, { useState, useEffect, useMemo } from 'react';
import {
	View,
	Text,
	FlatList,
	Alert,
	TouchableOpacity,
	Image,
} from 'react-native';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import { getShiftDurationInMinutes } from '../../helperFunctions/dateFormatFunctions';
import { Picker } from '@react-native-picker/picker';
import { ShiftListProps } from '../../types';
import ShiftItem from './ShiftItem';
import { shift } from '../../types';
import useColors from '../../helperFunctions/useColors';
import useShifts from '../ShiftsProvider';
import CircleButton from '../CircleButton';
import CustomPicker from '../CustomPicker';
const ShiftList: React.FC<ShiftListProps> = ({ navigation }) => {
	const colors = useColors();
	type filter = 'week' | 'month' | 'all';
	const [currentFilter, setCurrentFilter] = useState<filter>('week');
	type sorter = 'start' | 'end' | 'duration';
	const [sorter, setSorter] = useState<sorter>('start');
	const [sortingDirection, setSortingDirection] = useState<
		'descending' | 'ascending'
	>('descending');
	const { shifts, modifyShifts } = useShifts();
	async function addShiftScene() {
		softHaptic();
		navigation.navigate('AddShift', { current: null });
	}
	async function deleteShift(index: number) {
		softHaptic();
		Alert.alert(
			'Delete Shift',
			'Are you sure you want to delete the selected shift?',
			[
				{
					text: 'Yes',
					onPress: async () => {
						modifyShifts({ type: 'delete', value: { index: index } });
					},
				},
				{ text: 'No' },
			]
		);
	}
	async function editShift(index: number) {
		softHaptic();
		navigation.navigate('AddShift', {
			current: shifts[index],
		});
	}
	const changeSorter = (sorterType: sorter) => {
		if (sorterType === sorter) {
			if (sortingDirection === 'ascending') {
				setSortingDirection('descending');
			} else {
				setSortingDirection('ascending');
			}
		} else {
			setSorter(sorterType);
			setSortingDirection('descending');
		}
	};
	function filterData(
		data: shift[],
		filter = currentFilter,
		sort = sorter,
		direction = sortingDirection
	) {
		let returnData;
		switch (filter) {
			case 'week':
				let today = new Date();
				let dayOTW = today.getDay();
				let monday = new Date(
					today.setDate(today.getDate() - (dayOTW === 0 ? 6 : dayOTW - 1))
				);
				monday.setHours(0, 0, 0, 0);
				let nextMonday = new Date(monday.getTime());
				nextMonday.setDate(nextMonday.getDate() + 7);
				returnData = data.filter((value) => {
					const currentDate = new Date(value.startTime);
					return currentDate > monday && currentDate < nextMonday;
				});
				break;
			case 'month':
				let startOfMonth = new Date();
				startOfMonth.setDate(1);
				startOfMonth.setHours(0, 0, 0, 0);
				let startOfNext = new Date(startOfMonth.getTime());
				startOfNext.setMonth(startOfMonth.getMonth() + 1);
				returnData = data.filter((value) => {
					const currentDate = new Date(value.startTime);
					return currentDate > startOfMonth && currentDate < startOfNext;
				});
				break;
			case 'all':
				returnData = data;
				break;
			default:
				returnData = data;
				break;
		}
		returnData.sort((first, second) => {
			// sort data
			let firstDate;
			let secondDate;
			switch (sort) {
				case 'start':
					firstDate = first.startTime;
					secondDate = second.startTime;
					if (direction === 'ascending') {
						return firstDate - secondDate;
					} else {
						return -firstDate + secondDate;
					}
				case 'end':
					firstDate = first.endTime;
					secondDate = second.endTime;
					if (direction === 'ascending') {
						return firstDate - secondDate;
					} else {
						return -firstDate + secondDate;
					}
				case 'duration':
					firstDate = getShiftDurationInMinutes(first);
					secondDate = getShiftDurationInMinutes(second);
					if (direction === 'ascending') {
						return firstDate - secondDate;
					} else {
						return -firstDate + secondDate;
					}
				default:
					return 0;
			}
		});
		return returnData;
	}
	const filteredData = filterData(shifts);
	useEffect(() => {
		setSortingDirection('descending');
	}, [sorter]);
	const SortDisplay = useMemo(
		() =>
			({ style, opacity = 1 }: { style?: object; opacity?: number }) => {
				return (
					<Image
						style={{
							height: 12,
							width: 12,
							transform: [
								{
									rotateX:
										sortingDirection === 'descending' ? '0deg' : '180deg',
								},
							],
							marginLeft: 5,
							marginTop: 5,
							...style,
							opacity: opacity,
							tintColor: colors.textColor,
						}}
						source={require('../../img/icons-sorter.png')}
					/>
				);
			},
		[sortingDirection, colors]
	);
	const FilterSelect = useMemo(
		() => () => {
			return (
				<View
					style={{
						marginHorizontal: 5,
					}}
				>
					<CustomPicker<filter>
						textStyle={{ fontSize: 15, color: colors.textColor }}
						containerStyle={{
							marginHorizontal: 10,
							backgroundColor: colors.shiftBackground,
						}}
						dropDownItemStyle={{
							borderTopWidth: 0.5,
							borderTopColor: colors.seperatorColor,
						}}
						onChange={(value) => {
							softHaptic();
							setCurrentFilter(value);
						}}
						value={currentFilter}
						items={[
							{
								label: 'Current Week',
								value: 'week',
							},
							{
								label: 'Current Month',
								value: 'month',
							},
							{
								label: 'All',
								value: 'all',
							},
						]}
					/>
				</View>
			);
		},
		[colors, currentFilter]
	);
	const ListHeader = useMemo(
		() => () => {
			return (
				<View style={{ flexDirection: 'column' }}>
					<View
						style={{
							flexDirection: 'row',
							marginHorizontal: 2,
							paddingBottom: 4,
							paddingTop: 6,
						}}
					>
						<TouchableOpacity
							style={{
								flex: 1,
								justifyContent: 'center',
								flexDirection: 'row',
							}}
							onPress={() => changeSorter('start')}
						>
							<Text
								style={{
									fontWeight: 'bold',
									color: colors.textColor,
								}}
							>
								Shift Start
							</Text>
							<SortDisplay opacity={sorter === 'start' ? 1 : 0} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								flex: 1,
								justifyContent: 'center',
								flexDirection: 'row',
							}}
							onPress={() => {
								changeSorter('end');
							}}
						>
							<Text
								style={{
									fontWeight: 'bold',
									color: colors.textColor,
								}}
							>
								Shift End
							</Text>
							<SortDisplay opacity={sorter === 'end' ? 1 : 0} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								flex: 2,
								justifyContent: 'center',
								flexDirection: 'row',
								maxWidth: 150,
								marginHorizontal: 5,
							}}
							onPress={() => {
								changeSorter('duration');
							}}
						>
							<Text
								style={{
									fontWeight: 'bold',
									color: colors.textColor,
								}}
							>
								Duration
							</Text>
							<SortDisplay opacity={sorter === 'duration' ? 1 : 0} />
						</TouchableOpacity>
					</View>
				</View>
			);
		},
		[currentFilter, sortingDirection, sorter, colors]
	);
	const emptyComponent = useMemo(
		() => () => {
			return (
				<View
					style={{ height: '100%', position: 'relative', alignItems: 'center' }}
				>
					<View style={{ marginTop: '15%' }}>
						<Text
							style={{
								fontSize: 20,
								fontStyle: 'italic',
								fontWeight: 'bold',
								color: '#a3a3a3',
							}}
						>
							No entries
						</Text>
					</View>
					<View style={{ marginTop: '5%' }}>
						<Text
							style={{ fontSize: 15, fontWeight: 'bold', color: '#a3a3a3' }}
						>
							Add new entry bellow
						</Text>
					</View>
				</View>
			);
		},
		[addShiftScene, colors]
	);
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'flex-start',
				alignItems: 'stretch',
				marginTop: 10,
			}}
		>
			<View style={{ flex: 1, flexDirection: 'column' }}>
				<FilterSelect />
				<ListHeader />
				<View style={{ flex: 8 }}>
					<FlatList
						data={filteredData}
						renderItem={(item) => {
							return (
								<ShiftItem
									item={item}
									deleteShift={deleteShift}
									editShift={editShift}
								/>
							);
						}}
						keyExtractor={(item, index) => {
							return (
								item.endTime.toString() +
								item.startTime.toString() +
								item.notes +
								index.toString()
							);
						}}
						contentContainerStyle={{ paddingBottom: 5, flexGrow: 1 }}
						ListEmptyComponent={emptyComponent}
					/>
				</View>
			</View>
			<CircleButton
				backgroundColor={colors.buttonBlue}
				onPress={addShiftScene}
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
						source={require('../../img/icons-plus.png')}
					/>
				}
			/>
		</View>
	);
};
export default ShiftList;
