import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const buttons = [
  ['C', '%', '÷', '<'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '-'],
  ['00', '0', '.', '='],
];

// Safe-ish evaluator: only allows digits, whitespace, and + - * / ( )
function safeEvaluate(expr: string): string {
  const normalized = expr.replace(/×/g, '*').replace(/÷/g, '/');
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) return 'Error';
  try {
    // Function constructor still avoids scope access eval() has,
    // and the regex above blocks anything but arithmetic characters.
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${normalized})`)();
    if (typeof result !== 'number' || !isFinite(result)) return 'Error';
    return String(result);
  } catch {
    return 'Error';
  }
}

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  const pushHistory = (entry: string) => {
    setHistory((prev) => [...prev, entry].slice(-3));
  };

  const handlePress = (value: string) => {
    if (value === 'C') {
      setDisplay('0');
      return;
    }

    if (value === '<') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }

    if (value === '%') {
      const result = safeEvaluate(display);
      if (result !== 'Error') {
        const percentVal = String(parseFloat(result) / 100);
        pushHistory(display);
        setDisplay(percentVal);
      }
      return;
    }

    if (value === '=') {
      const result = safeEvaluate(display);
      pushHistory(display);
      setDisplay(result);
      return;
    }

    setDisplay((prev) => (prev === '0' && value !== '.' ? value : prev + value));
  };

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#000" />
        <Text style={styles.backText}>BACK</Text>
      </Pressable>

      <View style={styles.displayBox}>
        <ScrollView contentContainerStyle={styles.historyWrap}>
          {history.map((entry, i) => (
            <Text
              key={i}
              style={[
                styles.historyText,
                i === history.length - 1 && styles.historyTextRecent,
              ]}
            >
              {entry}
            </Text>
          ))}
        </ScrollView>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      {buttons.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((btn) => (
            <Pressable
              key={btn}
              style={[styles.button, btn === '00' && styles.wideButton]}
              onPress={() => handlePress(btn)}
            >
              <Text style={styles.buttonText}>{btn}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5fafa',
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  backText: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 2,
  },
  displayBox: {
    width: '100%',
    minHeight: 180,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#d8d8d8',
    borderRadius: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  historyWrap: {
    alignItems: 'flex-end',
  },
  historyText: {
    color: '#8a8a8a',
    fontSize: 14,
    marginBottom: 2,
  },
  historyTextRecent: {
    color: '#5a5a5a',
    fontSize: 16,
  },
  displayText: {
    color: '#1a1a1a',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  button: {
    width: 100,
    height: 100,
    backgroundColor: '#0f6e56',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wideButton: {
    width: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: '#f0b04a',
    fontSize: 50,
    fontWeight: 'bold',
  },
});