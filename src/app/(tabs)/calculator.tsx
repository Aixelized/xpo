import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';

const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['C', '0', '=', '+'],
];

// Safe-ish evaluator: only allows digits, whitespace, and + - * / ( )
function safeEvaluate(expr: string): string {
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) return 'Error';
  try {
    // Function constructor still avoids scope access eval() has,
    // and the regex above blocks anything but arithmetic characters.
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr})`)();
    if (typeof result !== 'number' || !isFinite(result)) return 'Error';
    return String(result);
  } catch {
    return 'Error';
  }
}

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');

  const handlePress = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      return;
    }

    if (value === '=') {
      setDisplay(safeEvaluate(display));
      return;
    }

    setDisplay(display === '0' ? value : display + value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayBox}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      {buttons.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((btn) => (
            <Pressable
              key={btn}
              style={styles.button}
              onPress={() => handlePress(btn)}
            >
              <Text style={styles.buttonText}>{btn}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      <Link href="/about" style={styles.button}>Exit Calculator</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayBox: {
    width: '85%',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#1c1f23',
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  displayText: {
    color: '#fff',
    fontSize: 40,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: '#ffd33d',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#25292e',
    fontSize: 24,
    fontWeight: 'bold',
  },
});