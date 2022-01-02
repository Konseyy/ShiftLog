import { DefaultTheme, Theme } from '@react-navigation/native';
const lightColors = {
	background: '#e6e6e6',
	textColor: 'black',
	buttonBlue: '#26a5ff',
	buttonGreen: 'green',
	topBar: 'white',
	switchThumbColor: 'black',
	dateSelectBackground: 'lightgray',
	seperatorColor: 'lightgray',
	selectedBackground: 'gray',
	notSelectedBackground: 'darkgray',
	selectedNav: '#26a5ff',
	shiftBackground: '#d6d6d6',
	buttonGray: '#8c8c8c',
};
const darkColors = {
	buttonBlue: '#430157',
	buttonGreen: '#006e1d',
	background: '#636363',
	topBar: '#333333',
	textColor: '#e6e6e6',
	switchThumbColor: 'black',
	dateSelectBackground: 'gray',
	seperatorColor: 'gray',
	selectedBackground: 'darkgray',
	notSelectedBackground: 'gray',
	selectedNav: 'white',
	shiftBackground: 'gray',
	buttonGray: '#9c9c9c',
};

const getColors = (isDark = true) => {
	const returnColors = isDark ? darkColors : lightColors;
	const customTheme: Theme = {
		...DefaultTheme,
		dark: isDark,
		colors: {
			primary: returnColors.selectedNav,
			background: returnColors.background,
			text: returnColors.textColor,
			card: returnColors.topBar,
			notification: 'gray',
			border: 'black',
		},
	};
	return { ...returnColors, theme: customTheme };
};
export default getColors;
