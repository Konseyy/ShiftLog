import React from "react";
import { Button, View } from "react-native";
const DataOptions = ({ navigation }) => {
	const goToReport = () => {
		navigation.navigate("MakeReport");
	}
	const goToBackup = () => {
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