import React from 'react';
import {View, TouchableOpacity} from 'react-native';

const SimpleCircleButton = ({
  circleDiameter = 30,
  onPress = () => {},
  style,
  backgroundColor = 'rgba(20,174,255,0.51)',
}) => {
  return (
    <View
      style={{
        position: 'relative',
        ...style,
      }}>
      <TouchableOpacity
        activeOpacity={0.5} //The opacity of the button when it is pressed
        style={{
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignContent: 'center',
          borderWidth: 0.35,
          borderRadius: circleDiameter / 2,
          width: circleDiameter,
          height: circleDiameter,
        }}
        onPress={onPress}
      >
      </TouchableOpacity>
    </View>
  );
};

export default SimpleCircleButton;
