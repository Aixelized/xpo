import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Link } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { savePhoto } from './photostorage';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
        <Link href="/about" style={styles.exitLink}>Exit Camera</Link>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isSaving) return;
    try {
      setIsSaving(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        await savePhoto(photo.uri);
        Alert.alert('Saved', 'Photo saved to local storage.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to capture or save photo.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <Pressable
            style={styles.smallButton}
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          >
            <Text style={styles.buttonText}>Flip</Text>
          </Pressable>

          <Pressable style={styles.captureButton} onPress={handleCapture} disabled={isSaving}>
            <View style={styles.captureInner} />
          </Pressable>

          <Link href="/gallery" style={[styles.smallButton, styles.buttonText]}>
            Gallery
          </Link>
        </View>
      </CameraView>

      <Link href="/" style={[styles.exitLink, styles.buttonText]}>
        Exit Camera
      </Link>
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
    marginBottom: 12,
  },
  camera: {
    width: '100%',
    flex: 1,
  },
  controls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffd33d',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25292e',
  },
  smallButton: {
    backgroundColor: '#ffd33d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  
  button: {
    marginTop: 16,
    backgroundColor: '#ffd33d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#25292e',
    fontWeight: 'bold',
  },
  exitLink: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 16,
    backgroundColor: '#ffd33d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
});