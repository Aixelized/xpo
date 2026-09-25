import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SectionList,
  Image,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSavedPhotos, deletePhoto, SavedPhoto } from './photostorage';

const screenWidth = Dimensions.get('window').width;
const GRID_PADDING = 20;
const GRID_GAP = 10;
const COLUMNS = 3;
const CARD_SIZE = (screenWidth - GRID_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS;

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return 'TODAY';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase();
}

function groupByDate(photos: SavedPhoto[]) {
  const groups: Record<string, SavedPhoto[]> = {};
  photos.forEach((photo) => {
    // Adjust this field to match whatever timestamp your SavedPhoto type uses
    const key = new Date((photo as any).createdAt ?? Date.now()).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(photo);
  });
  return Object.entries(groups)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([date, data]) => ({ title: formatDateLabel(date), data: [data] }));
  // data wrapped in a single-element array so each section has exactly one "row group" to render as a grid
}

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);
  const [selected, setSelected] = useState<SavedPhoto | null>(null);
  const router = useRouter();

  const loadPhotos = useCallback(async () => {
    setPhotos(await getSavedPhotos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [loadPhotos])
  );

  const sections = useMemo(() => groupByDate(photos), [photos]);

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
    <View style={styles.screen}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color="#000" />
        <Text style={styles.backText}>BACK</Text>
      </Pressable>

      <SectionList
        sections={sections}
        keyExtractor={(_, index) => `row-${index}`}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <View style={styles.dateRow}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>{section.title}</Text>
            </View>
          </View>
        )}
        renderItem={({ item: rowPhotos }) => (
          <View style={styles.grid}>
            {rowPhotos.map((photo) => (
              <Pressable
                key={photo.id}
                style={styles.thumbnail}
                onPress={() => setSelected(photo)}
              >
                <Image source={{ uri: photo.uri }} style={styles.thumbnailImage} resizeMode="cover" />
              </Pressable>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No photos saved yet.</Text>}
      />

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          {selected && (
            <Image source={{ uri: selected.uri }} style={styles.fullImage} resizeMode="contain" />
          )}
          <Pressable
            style={styles.deleteButton}
            onPress={() => selected && handleDelete(selected.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5fafa',
    paddingTop: 60,
    paddingHorizontal: GRID_PADDING,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 2,
  },
  list: {
    paddingBottom: 40,
  },
  dateRow: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: 8,
  },
  datePill: {
    backgroundColor: '#e4e9e8',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4a4a4a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 16,
  },
  thumbnail: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#d8d8d8',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
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
  deleteButton: {
    marginTop: 24,
    backgroundColor: '#e24b4a',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});