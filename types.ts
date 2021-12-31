import { NativeStackScreenProps } from "@react-navigation/native-stack"
import {FC} from "react"

export interface shift {
	startTime: number,
	endTime: number,
	break: number,
	notes: string,
	index: number,
}
export interface shiftToAdd {
	startTime: number,
	endTime: number,
	break: number,
	notes: string,
}
export type RootStackParamList = {
	Shifts: undefined,
	Data: undefined,
	Settings: undefined,
}
export type ShiftStackParamList = {
	ShiftList: undefined,
	AddShift: {current: shift | null},
}
export type ShiftListProps = NativeStackScreenProps<ShiftStackParamList, "ShiftList">
export type AddShiftProps = NativeStackScreenProps<ShiftStackParamList, "AddShift">
export type ShiftStackComponent = FC<ShiftListProps> | FC<AddShiftProps>
export type DataStackParamList = {
	DataOptions: undefined,
	MakeReport: undefined,
	MakeBackup: undefined,
}
export type DataOptionsProps = NativeStackScreenProps<DataStackParamList, "DataOptions">
export type MakeReportProps = NativeStackScreenProps<DataStackParamList, "MakeReport">
export type MakeBackupProps = NativeStackScreenProps<DataStackParamList, "MakeBackup">
export type DataStackComponent = FC<DataOptionsProps> | FC<MakeReportProps> | FC<MakeBackupProps>

export type SettingsStackParamList = {
	SettingsMain: undefined,
}
export type SettingsMainProps = NativeStackScreenProps<SettingsStackParamList, "SettingsMain">
export type SettingsStackComponent = FC<SettingsMainProps>