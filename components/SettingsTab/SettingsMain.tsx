import React, { FC } from 'react';
import { Switch, Text, View } from 'react-native';
import { softHaptic } from '../../helperFunctions/hapticFeedback';
import useColors from '../../helperFunctions/useColors';
import { SettingsMainProps } from '../../types';
import { useSettings } from '../SettingsProvider';
const SettingsMain: FC<SettingsMainProps> = () => {
	const { toggleDarkMode, darkMode } = useSettings();
	const colors = useColors();
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 15,
					marginTop: 10,
					alignItems: 'center',
				}}
			>
				<Text style={{ fontSize: 15, fontWeight: 'bold', color:colors.textColor }}>
					{'Toggle dark Mode'}
				</Text>
				<Switch
					style={{ marginLeft: 10 }}
					trackColor={{ false: 'gray', true: 'purple' }}
					thumbColor={colors.switchThumbColor}
					onValueChange={() => {
						softHaptic();
						toggleDarkMode();
					}}
					value={darkMode}
				/>
			</View>
		</View>
	);
};
export default SettingsMain;
