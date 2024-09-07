import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AppRouter from './src/navigators/AppRouter';
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppRouter />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App