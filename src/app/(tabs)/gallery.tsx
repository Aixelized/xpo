import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Image, Alert } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { getSavedPhotos, deletePhoto, SavedPhoto } from './photostorage';
export default function GalleryScreen() {
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);

  const loadPhotos = useCallback(async () => {
    setPhotos(await getSavedPhotos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [loadPhotos])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete Photo', 'Remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePhoto(id);
          loadPhotos();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Saved Photos ({photos.length})</Text>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.text}>No photos saved yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Link href="/camera" style={[styles.button, styles.buttonText]}>
        Back to Camera
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingTop: 24,
  },
  text: {
    color: '#fff',
    marginBottom: 12,
  },
  list: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1c1f23',
    padding: 6,
    alignItems: 'center',
  },
  thumbnail: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#ffd33d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  button: {
    marginVertical: 16,
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