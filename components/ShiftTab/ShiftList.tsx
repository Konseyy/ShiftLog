import React, { useState, useEffect, useMemo } from 'react';
import {
	View,
	Text,
	Button,
	FlatList,
	Alert,
	TouchableOpacity,
	Image,
} from 'react-native';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import {
	getShiftDurationInMinutes,
	displayHoursAndMinutes,
} from '../../helperFunctions/dateFormatFunctions';
import { Picker } from '@react-native-picker/picker';
import useShiftList from '../../helperFunctions/useShiftList';
import ShiftItem from './ShiftItem';
interface Props {
	navigation: any,
	route: any,
}
import { shift } from '../types/shifts';
const ShiftList = ({ navigation, route }: Props) => {
	const [currentFilter, setCurrentFilter] = useState('week');
	const [minutesInInterval, setMinutesInInterval] = useState("");
	const [sorter, setSorter] = useState('start');
	const [sortingDirection, setSortingDirection] = useState('descending');
	const { shifts, loading, refreshFromStorage, modifyShifts } = useShiftList();
	useEffect(()=>{
		console.log("lissst",shifts);
	},[shifts,loading])
	async function addShiftScene() {
		softHaptic();
		navigation.navigate('AddShift');
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
			],
		);
	}
	async function editShift(index: number) {
		softHaptic();
		navigation.navigate('AddShift', {
			current: {
				...filteredData[index],
				index: filteredData[index].index,
			},
		});
	}
	function filterData(
		data:shift[],
		sort = sorter,
		direction = sortingDirection,
		filter = currentFilter,
	) {
		let returnData;
		switch (filter) {
			case 'week':
				let today = new Date();
				let dayOTW = today.getDay();
				let monday = new Date(
					today.setDate(today.getDate() - (dayOTW === 0 ? 6 : dayOTW - 1)),
				);
				monday.setHours(0, 0, 0, 0);
				let nextMonday = new Date(monday.getTime());
				nextMonday.setDate(nextMonday.getDate() + 7);
				returnData = data.filter(value => {
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
				returnData = data.filter(value => {
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
					} else{
						return firstDate - secondDate;
					}
				case 'end':
					firstDate = first.endTime;
					secondDate = second.endTime;
					if (direction === 'ascending') {
						return firstDate - secondDate;
					} else {
						return firstDate - secondDate;
					}
				case 'duration':
					firstDate = getShiftDurationInMinutes(first);
					secondDate = getShiftDurationInMinutes(second);
					if (direction === 'ascending') {
						return firstDate - secondDate;
					} else {
						return firstDate - secondDate;
					}
				default:
					return 0;
			}
		});
		return returnData;
	}
	// const filteredData = useMemo(()=>filterData(shifts),[shifts,sortingDirection,sorter,currentFilter]);
	const filteredData = filterData(shifts);
	function updateTimeClocked(shifts = filteredData) {
		let newMinutes = 0;
		filterData(shifts, currentFilter).forEach(shiftObject => {
			newMinutes += getShiftDurationInMinutes(shiftObject);
		});
		setMinutesInInterval(displayHoursAndMinutes(newMinutes));
	}

	useEffect(() => {
		//Refresh every time load this scene
		const unsubscribe = navigation.addListener('focus', () => {
			refreshFromStorage();
		});
		return unsubscribe;
	}, [navigation]);
	useEffect(() => {
		updateTimeClocked();
	}, [shifts, currentFilter]);
	useEffect(() => {
		setSortingDirection('descending');
	}, [sorter]);
	const SortDisplay = useMemo(
		() =>
			({ style, opacity = 1 }: {style?:object, opacity?:number}) => {
				return (
					<Image
						style={{
							height: 10,
							width: 10,
							transform: [
								{ rotateX: sortingDirection === 'ascending' ? '0deg' : '180deg' },
							],
							marginLeft: 5,
							marginTop: 5,
							...style,
							opacity:opacity
						}}
						source={require('../../img/icons8-triangle-96.png')}
					/>
				);
			},
		[sortingDirection],
	);
	const FilterSelect = useMemo(
		() => () => {
			return (
				<View style={{ height: 50, marginHorizontal: 5 }}>
					<Picker
						selectedValue={currentFilter}
						onValueChange={value => {
							softHaptic();
							setCurrentFilter(value);
						}}>
						<Picker.Item label="Current week" value={'week'} />
						<Picker.Item label="Current month" value={'month'} />
						<Picker.Item label="All" value={'all'} />
					</Picker>
				</View>
			);
		},
		[currentFilter],
	);
	const ListHeader = useMemo(
		() => ({style}:{style?:object}) => {
			return (
				<View>
					<View
						style={{
							flexDirection: 'row',
							marginHorizontal: 2,
							paddingBottom: 4,
							paddingTop: 6,
							borderBottomColor: '#000000',
							borderBottomWidth: 0.5,
							borderTopWidth: 0.5,
							borderTopColor: '#000000',
						}}>
						<TouchableOpacity
							style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}
							onPress={() => {
								if (sorter === 'start') {
									if (sortingDirection === 'ascending') {
										setSortingDirection('descending');
									} else {
										setSortingDirection('ascending');
									}
								} else {
									setSorter('start');
								}
							}}>
							<Text style={{ fontWeight: 'bold' }}>Shift Start</Text>
							<SortDisplay opacity={sorter === 'start' ? 1 : 0} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}
							onPress={() => {
								if (sorter === 'end') {
									if (sortingDirection === 'ascending') {
										setSortingDirection('descending');
									} else {
										setSortingDirection('ascending');
									}
								} else {
									setSorter('end');
									setSortingDirection('descending');
								}
							}}>
							<Text style={{ fontWeight: 'bold' }}>Shift End</Text>
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
								if (sorter === 'duration') {
									if (sortingDirection === 'ascending') {
										setSortingDirection('descending');
									} else {
										setSortingDirection('ascending');
									}
								} else {
									setSorter('duration');
									setSortingDirection('descending');
								}
							}}>
							<Text style={{ fontWeight: 'bold' }}>Duration</Text>
							<SortDisplay opacity={sorter === 'duration' ? 1 : 0} />
						</TouchableOpacity>
					</View>
				</View>
			);
		},
		[currentFilter, sortingDirection, sorter],
	);
	const ListFooter = useMemo(
		() =>
			({ style }:{style?:object}) => {
				return (
					<View style={{ ...style }}>
						<Text
							style={{
								fontSize: 15,
								fontWeight: 'bold',
								marginLeft: 15,
								marginVertical: 3,
							}}>
							{`Selected Period: ${minutesInInterval}`}
						</Text>
						<Button
							color={'#26a5ff'}
							title="add shift"
							onPress={() => addShiftScene()}
						/>
					</View>
				);
			},
		[minutesInInterval, currentFilter, addShiftScene],
	);
	const emptyComponent = useMemo(
		() => () => {
			return (
				<View
					style={{ height: '100%', position: 'relative', alignItems: 'center' }}>
					<View style={{ marginTop: '15%' }}>
						<Text
							style={{
								fontSize: 20,
								fontStyle: 'italic',
								fontWeight: 'bold',
								color: '#a3a3a3',
							}}>
							No entries
						</Text>
					</View>
					<View style={{ marginTop: '5%' }}>
						<Text style={{ fontSize: 15, fontWeight: 'bold', color: '#a3a3a3' }}>
							Add new entry bellow
						</Text>
					</View>
				</View>
			);
		},
		[addShiftScene],
	);
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'flex-start',
				alignItems: 'stretch',
			}}>
			{!loading && (
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<FilterSelect />
					<ListHeader style={{ flex: 1 }} />
					<View style={{ flex: 8 }}>
						<FlatList
							data={loading ? null : filteredData}
							renderItem={item => {
								return (
									<ShiftItem
										item={item}
										navigation={navigation}
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
					<ListFooter
						style={{
							width: '100%',
							flexDirection: 'column',
							justifyContent: 'center',
							borderTopColor: '#000000',
							borderTopWidth: 0.6,
						}}
					/>
				</View>
			)}
		</View>
	);
};
export default ShiftList;
