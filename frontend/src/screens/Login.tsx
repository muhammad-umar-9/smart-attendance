import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('alice.teacher@example.com');
  const [password, setPassword] = useState('TeacherPass123');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      Alert.alert('Login failed', err?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Attendance</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={loading ? 'Signing in...' : 'Sign in'} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6 },
});
