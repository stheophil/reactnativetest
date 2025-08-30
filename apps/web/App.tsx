import React from 'react';
import {View, Text} from 'react-native';
import {HelloWorld} from "@org/common";

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'purple',
      }}>
      <HelloWorld/>
    </View>
  );
};

export default App;