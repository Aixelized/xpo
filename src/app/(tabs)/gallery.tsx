import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { getSavedPhotos, deletePhoto, SavedPhoto } from './photostorage';

const screenWidth = Dimensions.get('window').width;

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);
  const [selected, setSelected] = useState<SavedPhoto | null>(null);

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
          setSelected(null);
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
            <Pressable onPress={() => setSelected(item)}>
              <Image
                source={{ uri: item.uri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Link href="/camera" style={[styles.button, styles.buttonText]}>
        Back to Camera
      </Link>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          {selected && (
            <Image
              source={{ uri: selected.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
          <Pressable style={styles.closeButton} onPress={() => setSelected(null)}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const CARD_SIZE = (screenWidth - 48) / 2;

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
    width: CARD_SIZE,
    margin: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1c1f23',
    padding: 6,
    alignItems: 'center',
  },
  thumbnail: {
    width: CARD_SIZE - 12,
    height: CARD_SIZE - 12,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '75%',
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#ffd33d',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});