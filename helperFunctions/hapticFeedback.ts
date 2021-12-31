import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const hapticOptions = {
	enableVibrateFallback: false,
	ignoreAndroidSystemSettings: false,
};
export const softHaptic = () => {
	ReactNativeHapticFeedback.trigger('soft', hapticOptions);
};
