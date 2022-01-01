import { useEffect, useState } from 'react';
import { useSettings } from '../components/SettingsProvider';
import getColors from '../colors';
const useColors = () => {
	const { darkMode } = useSettings();
	const [colors, setColors] = useState(getColors(darkMode));
	useEffect(() => {
		setColors(getColors(darkMode));
	}, []);
	useEffect(() => {
		setColors(getColors(darkMode));
	}, [darkMode]);
	return colors;
};
export default useColors;
