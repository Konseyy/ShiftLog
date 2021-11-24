import React from 'react';
import {View, Text, Button} from 'react-native';
import SimpleCircleButton from '../SimpleCircleButton';
const ShiftList = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <View style={{flex: 1}}>
        <Text>Home Screen</Text>
        <Button title="Add Shift" onPress={()=>navigation.push('AddShift')}/>
        <SimpleCircleButton
          style={{
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            bottom: 25,
            right:25,
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
          }}
          circleDiameter={55}
          onPress={() => {
            navigation.push('AddShift');
          }}
        />
      </View>
    </View>
  );
};
export default ShiftList;
