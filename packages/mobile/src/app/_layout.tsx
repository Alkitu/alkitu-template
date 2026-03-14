import '../global.css';


import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TrpcProvider } from '../lib/trpc-provider';

export default function RootLayout() {
  return (
    <TrpcProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </TrpcProvider>
  );
}
