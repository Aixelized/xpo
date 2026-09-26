import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={logIn}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
      <Link href="/signup" style={styles.link}>
        Don't have an account? Sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', padding: 24 },
  title: { color: '#000', fontSize: 28, marginBottom: 24, fontWeight: 'bold' },
  input: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: { backgroundColor: '#0f6e5c', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#25292e', fontWeight: 'bold' },
  link: { color: '#fff', marginTop: 16, textAlign: 'center', textDecorationLine: 'underline' },
});