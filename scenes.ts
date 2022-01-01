import { ShiftsScene, DataScene, SettingsScene } from './components/TabStacks';
import ShiftList from './components/ShiftTab/ShiftList';
import AddShift from './components/ShiftTab/AddShift';
import DataOptions from './components/DataTab/DataOptions';
import SettingsMain from './components/SettingsTab/SettingsMain';
import ExportFile from './components/DataTab/ExportFile';
import {
	RootStackParamList,
	ShiftStackParamList,
	DataStackParamList,
	SettingsStackParamList,
	ShiftStackComponent,
	DataStackComponent,
	SettingsStackComponent,
} from './types';
export interface Tab {
	name: keyof RootStackParamList;
	component: () => JSX.Element;
	options?: object;
}
export const Tabs: Tab[] = [
	{
		name: 'Shifts',
		component: ShiftsScene,
	},
	{
		name: 'Data',
		component: DataScene,
	},
	{
		name: 'Settings',
		component: SettingsScene,
	},
];
interface ShiftTab {
	name: keyof ShiftStackParamList;
	component: ShiftStackComponent;
	options?: {
		title: string;
	};
}
export const ShiftTab: ShiftTab[] = [
	{
		name: 'ShiftList',
		component: ShiftList,
		options: {
			title: 'Archive',
		},
	},
	{
		name: 'AddShift',
		component: AddShift,
	},
];
interface DataTab {
	name: keyof DataStackParamList;
	component: DataStackComponent;
	options?: {
		title: string;
	};
}
export const DataTab: DataTab[] = [
	{
		name: 'DataOptions',
		component: DataOptions,
		options: {
			title: 'Data',
		},
	},
	{
		name: 'ExportFile',
		component: ExportFile,
		options: {
			title: 'New Report',
		},
	},
];
interface SettingsTab {
	name: keyof SettingsStackParamList;
	component: SettingsStackComponent;
	options?: {
		title: string;
	};
}
export const SettingsTab: SettingsTab[] = [
	{
		name: 'SettingsMain',
		component: SettingsMain,
		options: {
			title: 'Settings',
		},
	},
];
