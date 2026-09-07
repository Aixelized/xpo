import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AboutScreen() {
  const { logOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <Pressable style={styles.button} onPress={logOut}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
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
  text: {
    color: '#fff',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#ffd33d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#25292e',
    fontWeight: 'bold',
  },
});