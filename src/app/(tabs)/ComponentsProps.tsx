import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

function LabeledInput({ label, value, onChangeText, placeholder }: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const [name, setName] = useState('');           // live input value
  const [displayName, setDisplayName] = useState(''); // what the header shows

  const handleSubmit = () => {
    if (name.trim() !== '') {
      setDisplayName(name);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {displayName || '_'}!</Text>

      <View style={styles.card}>
        <LabeledInput
          label="Enter your Name:"
          value={name}
          onChangeText={setName}
          placeholder="Enter"
        />
        <ActionButton label="Enter" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#0f6e56',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f0b04a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#f0b04a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});