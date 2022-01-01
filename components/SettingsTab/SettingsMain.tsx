import React, { FC, useContext, useEffect } from 'react';
import { Button, Switch, View } from 'react-native';
import useColors from '../../helperFunctions/useColors';
import { SettingsMainProps } from '../../types';
import { useSettings } from '../SettingsProvider';
const SettingsMain: FC<SettingsMainProps> = () => {
	const { toggleDarkMode, darkMode } = useSettings();
	const colors = useColors();
	return (
		<View style={{ flex: 1 }}>
			<View>
				<Switch
					trackColor={{ false: 'gray', true: 'purple' }}
					thumbColor={colors.switchThumbColor}
					onValueChange={toggleDarkMode}
					value={darkMode}
				/>
			</View>
		</View>
	);
};
export default SettingsMain;
