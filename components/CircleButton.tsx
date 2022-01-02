import React, { FC } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
interface Props {
	onPress: () => void;
	backgroundColor?: string;
	centerElement?: JSX.Element;
	height?: number;
	style?: ViewStyle;
}
const CircleButton: FC<Props> = ({
	onPress,
	backgroundColor,
	height = 60,
	centerElement,
	style,
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				position: 'absolute',
				bottom: 20,
				right: 20,
				backgroundColor: backgroundColor,
				height: height,
				width: height,
				borderRadius: height / 2 - 8,
				justifyContent: 'center',
				...style,
			}}
		>
			{centerElement}
		</TouchableOpacity>
	);
};
export default CircleButton;
