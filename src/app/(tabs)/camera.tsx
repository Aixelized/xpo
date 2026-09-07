import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const PHOTO_DIR = FileSystem.documentDirectory + 'photos/';

async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(PHOTO_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
  }
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState('back');
  const [photos, setPhotos] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  const loadSavedPhotos = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(PHOTO_DIR);
    const uris = files
      .sort()
      .reverse()
      .map((filename) => PHOTO_DIR + filename);
    setPhotos(uris);
  };

  const saveToLocalStorage = async (tempUri) => {
    await ensureDirExists();
    const filename = `photo_${Date.now()}.jpg`;
    const newPath = PHOTO_DIR + filename;
    await FileSystem.copyAsync({ from: tempUri, to: newPath });
    setPhotos((prev) => [newPath, ...prev]);
  };

  const deletePhoto = async (uri) => {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const confirmDelete = (uri) => {
    Alert.alert('Delete photo?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePhoto(uri) },
    ]);
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Camera access is required.');
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    setShowCamera(false);
    await saveToLocalStorage(photo.uri);
  };

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      await saveToLocalStorage(result.assets[0].uri);
    }
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef} />
        <TouchableOpacity onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
          <Text>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture}>
          <Text>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCamera(false)}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Text>Local Photo Storage</Text>

      <TouchableOpacity onPress={openCamera}>
        <Text>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickFromLibrary}>
        <Text>Pick from Library</Text>
      </TouchableOpacity>

      <Text>{photos.length} photo(s) saved locally</Text>

      <FlatList
        data={photos}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => confirmDelete(item)}>
            <Text>{item}</Text>
            <Image source={{ uri: item }} style={{ width: 80, height: 80 }} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No photos yet. Take one or pick from your library.</Text>}
      />
    </SafeAreaView>
  );
}