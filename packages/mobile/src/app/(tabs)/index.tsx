import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">Alkitu</Text>
      <Text className="mt-2 text-gray-500">Welcome to the mobile app</Text>
    </View>
  );
}
