import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import React, {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
} from 'react';
const systemDark = Appearance.getColorScheme() === 'dark';
interface SettingsTemplate {
	darkMode: boolean;
	toggleDarkMode: () => void;
}
const SettingsContext = createContext<SettingsTemplate>({
	darkMode: systemDark,
	toggleDarkMode: () => {},
});
const SettingsProvider: FC = ({ children }) => {
	const [isDarkMode, setDarkMode] = useState(systemDark);
	const toggleDark = () => {
		let newDark = !isDarkMode;
		setDarkMode(newDark);
		saveSettings({ dark: newDark });
	};
	interface savedSettings {
		dark: boolean;
	}
	const saveSettings = async (
		{ dark }: savedSettings = { dark: isDarkMode }
	) => {
		await AsyncStorage.setItem(
			'settings',
			JSON.stringify({
				darkMode: dark,
			})
		);
	};
	const getSettingsFromStorage = async () => {
		const settingsJSON = await AsyncStorage.getItem('settings');
		if (settingsJSON) {
			const settings = JSON.parse(settingsJSON);
			if (settings.darkMode) {
				setDarkMode(settings.darkMode);
			}
		} else {
			await saveSettings();
		}
	};
	useEffect(() => {
		getSettingsFromStorage();
	}, []);
	return (
		<SettingsContext.Provider
			value={{
				darkMode: isDarkMode,
				toggleDarkMode: toggleDark,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
const useSettings = () => useContext(SettingsContext);
export default SettingsProvider;
export { useSettings };
