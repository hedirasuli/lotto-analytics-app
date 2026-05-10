import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/styles';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../src/context/LanguageContext'; // Update path if needed


export default function Layout() {
  return (

    /* LanguageProvider must be the single parent element */
    <LanguageProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: { height: 60, paddingBottom: 10 },
          headerShown: false, // Hides header for all tab screens
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home', // We will translate this later
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
          }}
        />
      </Tabs>
    </LanguageProvider>
);
}