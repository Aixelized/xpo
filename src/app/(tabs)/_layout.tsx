import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F7BD53',
        headerStyle: { backgroundColor: '#f9fdfd' },
        headerShadowVisible: false,
        headerTintColor: '#222020',

        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          borderRadius: 24,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="gallery"
        options={{ href: null, tabBarStyle: { display: 'none' }, headerShown: false }}
      />
      <Tabs.Screen
        name="camera"
        options={{ href: null, tabBarStyle: { display: 'none' }, headerShown: false }}
      />
      <Tabs.Screen
        name="calculator"
        options={{ href: null, tabBarStyle: { display: 'none' }, headerShown: false }}
      />
      <Tabs.Screen
        name="photostorage"
        options={{ href: null, tabBarStyle: { display: 'none' }, headerShown: false }}
      />
    </Tabs>
  );
}