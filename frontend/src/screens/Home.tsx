import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Attendance</Text>
      <Button title="Courses" onPress={() => navigation.navigate('Courses')} />
      <View style={{ height: 10 }} />
      <Button title="Sessions" onPress={() => navigation.navigate('Sessions')} />
      <View style={{ height: 10 }} />
      <Button title="Sign out" onPress={() => signOut()} color="#c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
});
