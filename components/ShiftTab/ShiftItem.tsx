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
import useColors from '../../helperFunctions/useColors';
interface Props {
	item: ListRenderItemInfo<shift>;
	deleteShift: (index: number) => Promise<void>;
	editShift: (index: number) => Promise<void>;
}
const ShiftItem = ({ item, deleteShift, editShift }: Props) => {
	const colors = useColors();
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
						<Text style={{ color: colors.textColor }}>
							{stringTimeFromDate(startDate)}
						</Text>
						<Text style={{ color: colors.textColor }}>
							{stringDateFromDate(startDate, '/')}
						</Text>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Text style={{ color: colors.textColor }}>
							{stringTimeFromDate(endDate)}
						</Text>
						<Text style={{ color: colors.textColor }}>
							{stringDateFromDate(endDate, '/')}
						</Text>
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
							<Text style={{ color: colors.textColor }}>
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
									<Text style={{ fontWeight: 'bold', color: colors.textColor }}>
										Break duration:{' '}
									</Text>
									<Text style={{ color: colors.textColor }}>{breakTime}m</Text>
								</Text>
							</View>
							<View style={{ marginTop: 5 }}>
								<Text style={{ fontWeight: 'bold', color: colors.textColor }}>
									Additional notes:
								</Text>
								{ShiftData.notes ? (
									<Text style={{ color: colors.textColor }}>
										{ShiftData.notes}
									</Text>
								) : (
									<Text
										style={{ fontStyle: 'italic', color: colors.textColor }}
									>
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
									onPress={() => editShift(ShiftData.index)}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<Button
									color={'#6e0006'}
									title="delete"
									onPress={() => deleteShift(ShiftData.index)}
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
