import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, ListRenderItemInfo, ViewStyle } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
	stringDateFromDate,
	stringTimeFromDate,
	dateDifference,
} from '../../helperFunctions/dateFormatFunctions';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import { shift } from '../../types';
import { useSettings } from '../SettingsProvider';
import useColors from '../../helperFunctions/useColors';
interface Props {
	item: ListRenderItemInfo<shift>;
	deleteShift: (index: number) => Promise<void>;
	editShift: (index: number) => Promise<void>;
}
const ShiftItem = ({ item, deleteShift, editShift }: Props) => {
	const { darkMode } = useSettings();
	const colors = useColors();
	const [expanded, setExpanded] = useState(false);
	const ShiftData = item.item;
	const startDate = new Date(ShiftData.startTime);
	const endDate = new Date(ShiftData.endTime);
	const breakTime = ShiftData.break ?? 0;
	interface actionButtonsProps {
		onPress?: () => void;
		style?: ViewStyle;
		centerElement: JSX.Element;
	}
	const ActionButton: FC<actionButtonsProps> = ({
		onPress,
		style,
		centerElement,
	}) => {
		return (
			<TouchableOpacity onPress={onPress} style={style}>
				<View style={{ alignSelf: 'center' }}>{centerElement}</View>
			</TouchableOpacity>
		);
	};
	useEffect(() => {
		setExpanded(false);
	}, [darkMode]);
	return useMemo(
		() => (
			<TouchableOpacity
				style={{
					marginHorizontal: 10,
					padding: 5,
					backgroundColor: colors.shiftBackground,
					marginTop: 8,
					borderRadius: 5,
					borderBottomWidth: 0.5,
					borderLeftWidth: 0.5,
					borderRightWidth: 0.5,
					borderColor: 'black',
				}}
				onPress={() => {
					// softHaptic();
					setExpanded(!expanded);
				}}
				onLongPress={() => editShift(ShiftData.index)}
				delayLongPress={500}
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
							<View style={{ flex: 6 }} />
							<View style={{ flex: 11 }}>
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
					<Collapsible collapsed={!expanded} duration={200}>
						<View style={{ paddingBottom: 5 }}>
							<View
								style={{
									flex: 2,
									marginHorizontal: 25,
									marginVertical: 10,
									paddingTop: 5,
								}}
							>
								<View>
									<Text>
										<Text
											style={{ fontWeight: 'bold', color: colors.textColor }}
										>
											Break duration:{' '}
										</Text>
										<Text style={{ color: colors.textColor }}>
											{breakTime}m
										</Text>
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
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'row',
									}}
								>
									<View style={{ flex: 1 }} />
									<ActionButton
										onPress={() => editShift(ShiftData.index)}
										style={{
											flex: 6,
											backgroundColor: colors.buttonGray,
											borderRadius: 5,
											padding: 5,
										}}
										centerElement={
											<Text
												style={{
													color: 'white',
													fontSize: 17,
													letterSpacing: 1,
													fontWeight: 'bold',
												}}
											>
												Edit
											</Text>
										}
									/>
									<View style={{ flex: 1 }} />
								</View>
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										flexDirection: 'row',
									}}
								>
									<View style={{ flex: 1 }} />
									<ActionButton
										style={{
											flex: 6,
											backgroundColor: '#6e0006',
											borderRadius: 5,
											padding: 5,
										}}
										onPress={() => deleteShift(ShiftData.index)}
										centerElement={
											<Image
												style={{ height: 25, width: 25, tintColor: 'white' }}
												source={require('../../img/icons-delete.png')}
											/>
										}
									/>
									<View style={{ flex: 1 }} />
								</View>
							</View>
						</View>
					</Collapsible>
				</View>
			</TouchableOpacity>
		),
		[item, expanded, colors]
	);
};
export default ShiftItem;
