import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function IconButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.iconWrapper}>
        <View style={styles.iconButton}>
          <Ionicons name={icon} size={32} color="#fff" />
        </View>
        <Text style={styles.iconLabel}>{label}</Text>
      </Pressable>
    </Link>
  );
} 


export default function Index() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hello, Aixel!</Text>
        <Text style={styles.subtitle}>Let's make your memories last.</Text>
        <View style={styles.underline} />
      </View>

      {/* Icon grid */}
      <View style={styles.grid}>
        <IconButton href="/calculator" label="Calculator" icon="calculator-outline" />
        <IconButton href="/camera" label="Camera" icon="camera-outline" />
        <IconButton href="/gallery" label="Album" icon="image-outline" />
      </View>
      <View style={styles.grid}>
        <IconButton href="/ComponentsProps" label="Props" icon="cloud-upload-outline" />
        <IconButton href="/about" label="Profile" icon="person-circle-outline" />
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
  },
  header: {
    marginBottom: 100,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    marginTop: 4,
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: '#f5a623',
    marginTop: 12,
    borderRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    marginBottom: 30,
  },
  iconWrapper: {
    alignItems: 'center',
    width: 100,
  },
  iconButton: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#0f6e5c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
});