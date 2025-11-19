import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import CoursesScreen from '../screens/Courses';
import SessionsScreen from '../screens/Sessions';
import SessionDetails from '../screens/SessionDetails';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { token, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Smart Attendance' }} />
            <Stack.Screen name="Courses" component={CoursesScreen} />
            <Stack.Screen name="Sessions" component={SessionsScreen} />
            <Stack.Screen name="SessionDetails" component={SessionDetails} options={{ title: 'Session Details' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
