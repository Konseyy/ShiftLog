import ReactNativeHapticFeedback from "react-native-haptic-feedback";
export const softHaptic = () => {
    ReactNativeHapticFeedback.trigger("soft", {enableVibrateFallback:false,ignoreAndroidSystemSettings:false});
}