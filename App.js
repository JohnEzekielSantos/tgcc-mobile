import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainApp from './src/screens/MainApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0d0f14" />
      <MainApp />
    </SafeAreaProvider>
  );
}
