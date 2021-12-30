import React, { FC } from "react";
import { Button, View } from "react-native";
const DataOptions: FC<any> = ({ navigation }: {navigation: any}) => {
	const goToReport = (): void => {
		navigation.navigate("MakeReport");
	}
	const goToBackup = (): void => {
		navigation.navigate("MakeBackup");
	}
	return (
		<View>
			<Button color="gray" title={"Create backup"} onPress={goToBackup} />
			<Button color="green" title={"Generate report"} onPress={goToReport} />
		</View>
	);
}
export default DataOptions;