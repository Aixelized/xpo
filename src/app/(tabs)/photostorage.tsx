import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'saved_photos';
const PHOTOS_DIR = FileSystem.documentDirectory + 'photos/';

export type SavedPhoto = {
  id: string;
  uri: string;
  createdAt: string;
};

async function ensurePhotosDir() {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

export async function getSavedPhotos(): Promise<SavedPhoto[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function savePhoto(tempUri: string): Promise<void> {
  await ensurePhotosDir();
  const id = Date.now().toString();
  const destUri = `${PHOTOS_DIR}${id}.jpg`;
  await FileSystem.copyAsync({ from: tempUri, to: destUri });

  const newPhoto: SavedPhoto = { id, uri: destUri, createdAt: new Date().toISOString() };
  const existing = await getSavedPhotos();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newPhoto, ...existing]));
}

export async function deletePhoto(id: string): Promise<void> {
  const existing = await getSavedPhotos();
  const target = existing.find((p) => p.id === id);
  if (target) {
    const info = await FileSystem.getInfoAsync(target.uri);
    if (info.exists) await FileSystem.deleteAsync(target.uri, { idempotent: true });
  }
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((p) => p.id !== id))
  );
}