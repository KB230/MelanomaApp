import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './lib/supabase'; // Make sure this path is correct
import AuthScreen from './screens/AuthScreen';
import UploadScreen from './screens/UploadScreen';
import ModelInfoScreen from './screens/ModelInfoScreen'; // Import the new screen
import GalleryScreen from './screens/GalleryScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const MainApp = ({ setIsAuthenticated }) => {
  console.log("MainApp rendered");
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Upload"
        children={() => <UploadScreen setIsAuthenticated={setIsAuthenticated} />}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);  // Set authentication state based on session
      setIsLoading(false);  // Stop loading after checking session
    };

    checkSession();
  }, []);

  if (isLoading) {
    return null; // Optionally add a loading indicator here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "MainApp" : "AuthScreen"}>
        <Stack.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFF8E1' },
          }}
        />
        <Stack.Screen
          name="MainApp"
          options={{ headerShown: false }}
        >
          {() => <MainApp setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen
          name="ModelInfo"
          component={ModelInfoScreen}
          options={{ title: 'Model Information'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

