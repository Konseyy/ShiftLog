import React, { useEffect, useState } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { Text, TouchableOpacity, View, Button } from 'react-native';
import {
	stringDateFromDate,
	stringTimeFromDate,
	dateDifference,
} from '../../helperFunctions/dateFormatFunctions';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import { shift } from '../../types';
interface Props {
	item: ListRenderItemInfo<shift>;
	deleteShift: (index: number) => Promise<void>;
	editShift: (index: number) => Promise<void>;
}
const ShiftItem = ({ item, deleteShift, editShift }: Props) => {
	const [expanded, setExpanded] = useState(false);
	function addZero(i: number) {
		if (i < 10) {
			return '0' + i;
		}
		return i;
	}

	useEffect(() => {
		// console.log("current item is",item);
	}, []);
	const ShiftData = item.item;
	const startDate = new Date(ShiftData.startTime);
	const endDate = new Date(ShiftData.endTime);
	const breakTime = ShiftData.break ?? 0;
	return (
		<TouchableOpacity
			style={{ marginHorizontal: 2, paddingTop: 5 }}
			onPress={() => {
				softHaptic();
				setExpanded(!expanded);
			}}
		>
			<View style={{ flexDirection: 'column' }}>
				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Text>{stringTimeFromDate(startDate)}</Text>
						<Text>{stringDateFromDate(startDate, '/')}</Text>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Text>{stringTimeFromDate(endDate)}</Text>
						<Text>{stringDateFromDate(endDate, '/')}</Text>
					</View>
					<View
						style={{
							flex: 2,
							marginHorizontal: 5,
							maxWidth: 150,
							flexDirection: 'row',
						}}
					>
						<View style={{ flex: 2 }} />
						<View style={{ flex: 5 }}>
							<Text>
								{dateDifference(
									ShiftData.startTime,
									ShiftData.endTime,
									ShiftData.break
								)}
							</Text>
						</View>
					</View>
				</View>
				{expanded && (
					<>
						<View
							style={{
								flex: 2,
								marginHorizontal: 25,
								marginVertical: 10,
							}}
						>
							<View>
								<Text>
									<Text style={{ fontWeight: 'bold' }}>Break duration: </Text>
									<Text>{breakTime}m</Text>
								</Text>
							</View>
							<View style={{ marginTop: 5 }}>
								<Text style={{ fontWeight: 'bold' }}>Additional notes:</Text>
								{ShiftData.notes ? (
									<Text>{ShiftData.notes}</Text>
								) : (
									<Text style={{ fontStyle: 'italic' }}>
										No additional notes
									</Text>
								)}
							</View>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 1 }}>
								<Button
									color={'#8c8c8c'}
									title="edit"
									onPress={() => editShift(item.index)}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<Button
									color={'#6e0006'}
									title="delete"
									onPress={() => deleteShift(item.index)}
								/>
							</View>
						</View>
					</>
				)}
			</View>
		</TouchableOpacity>
	);
};
export default ShiftItem;
