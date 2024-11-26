import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
       
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        <Stack.Screen name="index" options={{headerShown:false}} />
      </Stack>
    </GestureHandlerRootView>
  );
}