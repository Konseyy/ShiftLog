import React, { FC } from 'react';
import { Button, View } from 'react-native';
import { DataOptionsProps } from '../../types';
const DataOptions: FC<DataOptionsProps> = ({ navigation }) => {
	const goToReport = (): void => {
		navigation.navigate('MakeReport');
	};
	const goToBackup = (): void => {
		navigation.navigate('MakeBackup');
	};
	return (
		<View>
			<Button color="gray" title={'Create backup'} onPress={goToBackup} />
			<Button color="green" title={'Generate report'} onPress={goToReport} />
		</View>
	);
};
export default DataOptions;
