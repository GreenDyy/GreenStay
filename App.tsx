import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AppRouter from './src/navigators/AppRouter';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import FlashMessage from 'react-native-flash-message';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/srcRedux/store';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <AppRouter />
        </NavigationContainer>
        <FlashMessage position="top" statusBarHeight={StatusBar.currentHeight} />
      </Provider>
    </GestureHandlerRootView>
  )
}

export default App