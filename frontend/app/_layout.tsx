import  React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider, useLanguage } from '../src/context/LanguageContext';

/**
 * Main Layout component that wraps everything with LanguageProvider.
 * This ensures the global language state is available everywhere.
 */

export default function Layout() {
  return (

    /* LanguageProvider must be the single parent element */
    <LanguageProvider>
      <TabContent />
    </LanguageProvider>
  );
}

/**
 * Separate component for Tab content so it can access 'useLanguage' hook.
 * A hook cannot be called in the same component where its Provider is defined.
 */
function TabContent() {
  // 2. Get the translation object (t) from context
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { 
          height: 60, 
          paddingBottom: 10,
          backgroundColor: '#fff' // You can adjust background color
        },
        headerShown: false, // Hide header for all screens
        tabBarActiveTintColor: '#007AFF', // Color for the active tab
      }}
    >
      {/* Home Screen Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: t.home, // Uses translation from locals.ts
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* Stats Screen Tab */}
      <Tabs.Screen
        name="stats"
        options={{
          title: t.stats, // Uses translation from locals.ts
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />

      {/* History Screen Tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: t.history, // Uses translation from locals.ts
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
        