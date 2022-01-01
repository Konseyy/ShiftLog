import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';
import SettingsProvider from './components/SettingsProvider';
import Content from './Content';
import { ShiftsProvider } from './components/ShiftsProvider';
LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
	'Remote debugger is in a background tab which may cause apps to perform slowly',
	'Require cycle: node_modules\\rn-fetch-blob\\index.js',
]);
const App = () => {
	return (
		<SettingsProvider>
			<ShiftsProvider>
				<Content />
			</ShiftsProvider>
		</SettingsProvider>
	);
};

export default App;
