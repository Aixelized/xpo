import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Separate container for Welcome */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.text}>Welcome!</Text>
      </View>

      <Link href="/about" style={styles.button}>About</Link>
      <Link href="/calculator" style={styles.button}>Calculator</Link>
      <Link href="/camera" style={styles.button}>Camera</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#25292e', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    paddingTop: 1 // Adjust this to push everything higher or lower from the top
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50// Space between Welcome and the links
  },
  text: { 
    color: '#fff', 
    fontSize: 100,
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
  button: { 
    fontSize: 20, 
    color: '#fff',// Adds small spacing between the link rows
  },
});