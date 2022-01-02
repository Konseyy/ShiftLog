import React, { useEffect, useState } from 'react';
import {
	Animated,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
type NonEmptyArray<T> = [T, ...T[]];
interface CustomPickerItem<T> {
	label: string;
	value: T;
	key?: string;
}
interface CustomPickerProps<T> {
	items: NonEmptyArray<CustomPickerItem<T>>;
	containerStyle?: ViewStyle;
	textStyle?: TextStyle;
	onChange?: (value: T) => void;
	defaultIndex?: number;
	value: T;
	dropdownDuration?: number;
	displayBoxStyle?: ViewStyle;
	dropDownItemStyle?: ViewStyle;
}
const CustomPicker = <T,>({
	containerStyle,
	textStyle,
	items,
	onChange,
	defaultIndex = 0,
	dropdownDuration = 300,
	value,
	displayBoxStyle,
	dropDownItemStyle,
}: CustomPickerProps<T>) => {
	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
	const [expanded, setExpanded] = useState(false);
	const [degrees] = useState(new Animated.Value(0));
	const [borderbottomRadius, setBorderBotttomRadius] = useState(
		displayBoxStyle?.borderBottomRightRadius ?? 5
	);
	const spin = degrees.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '-180deg'],
	});
	useEffect(() => {
		if (expanded) {
			setBorderBotttomRadius(0);
			Animated.timing(degrees, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			setTimeout(() => {
				setBorderBotttomRadius(displayBoxStyle?.borderBottomRightRadius ?? 5);
			}, dropdownDuration - 50);
			Animated.timing(degrees, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [expanded]);
	useEffect(() => {
		if (value) {
			items.forEach((i, x) => {
				if (i.value === value) {
					setSelectedIndex(x);
				}
			});
		} else {
			setSelectedIndex(defaultIndex);
		}
		setSelectedIndex(defaultIndex);
	}, []);
	useEffect(() => {
		if (value) {
			items.forEach((i, x) => {
				if (i.value === value) {
					setSelectedIndex(x);
				}
			});
		} else {
			setSelectedIndex(defaultIndex);
		}
	}, [value]);
	return (
		<View
			style={{ elevation: 10, position: 'relative', flexDirection: 'column' }}
		>
			<View style={{ position: 'relative' }}>
				<TouchableOpacity
					onPress={() => setExpanded((e) => !e)}
					style={{
						padding: 10,
						borderRadius: 5,
						borderBottomLeftRadius: borderbottomRadius,
						borderBottomRightRadius: borderbottomRadius,
						...containerStyle,
						...displayBoxStyle,
						flexDirection: 'row',
					}}
				>
					<Text style={{ ...textStyle }}>{items[selectedIndex].label}</Text>
					<Animated.View>
						<Animated.Image
							style={{
								height: 12,
								width: 12,
								top: 5,
								left: 5,
								tintColor: textStyle?.color ?? 'black',
								transform: [
									{
										rotate: spin,
									},
								],
							}}
							source={require('../img/icons-sorter.png')}
						/>
					</Animated.View>
				</TouchableOpacity>
			</View>
			<View style={{}}>
				<Collapsible collapsed={!expanded} duration={dropdownDuration}>
					{items.map((item, idx) => {
						if (idx === selectedIndex) return null;
						return (
							<TouchableOpacity
								key={idx.toString() + item.label}
								onPress={() => {
									setExpanded(false);
									setSelectedIndex(idx);
									if (onChange) {
										onChange(items[idx].value);
									}
								}}
								style={{
									padding: 10,
									position: 'relative',
									...containerStyle,
									...dropDownItemStyle,
									borderBottomLeftRadius:
										idx !== items.length - 1
											? 0
											: displayBoxStyle?.borderBottomLeftRadius ?? 5,
									borderBottomRightRadius:
										idx !== items.length - 1
											? 0
											: displayBoxStyle?.borderBottomRightRadius ?? 5,
								}}
							>
								<Text
									key={idx.toString() + item.label + 'text'}
									style={{ ...textStyle }}
								>
									{item.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</Collapsible>
			</View>
		</View>
	);
};
export default CustomPicker;
