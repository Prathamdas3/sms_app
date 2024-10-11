import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import {Appearance} from 'react-native'

export default function RootLayout() {
  Appearance.setColorScheme('light')
  return (
    <PaperProvider >
      <Stack screenOptions={{ animation: 'slide_from_bottom' }}>
      <Stack.Screen name="index" options={{ title: "Expense Tracker", headerTitleAlign: "center" }} />
    </Stack>
    </PaperProvider>
  );
}
