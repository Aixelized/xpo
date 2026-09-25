import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, Modal, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { savePhoto } from './photostorage';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isSaving, setIsSaving] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

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
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        setPreviewUri(photo.uri); // just preview it, don't save yet
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to capture photo.');
      console.error(err);
    }
  };

  const handleConfirmSave = async () => {
    if (!previewUri) return;
    try {
      setIsSaving(true);
      await savePhoto(previewUri);
      setPreviewUri(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to save photo.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color="#000" />
        <Text style={styles.backText}>BACK</Text>
      </Pressable>

      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </CameraView>
      </View>

      <View style={styles.controls}>
        <Link href="/gallery" asChild>
          <Pressable>
            <Ionicons name="image-outline" size={26} color="#000" />
          </Pressable>
        </Link>

        <Pressable style={styles.captureButton} onPress={handleCapture} disabled={isSaving}>
          <Ionicons name="camera" size={24} color="#fff" />
        </Pressable>

        <Pressable onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
          <Ionicons name="repeat-outline" size={26} color="#000" />
        </Pressable>
      </View>

      <Modal visible={previewUri !== null} transparent animationType="fade">
        <View style={styles.previewBackdrop}>
          <Image source={{ uri: previewUri ?? '' }} style={styles.previewImage} resizeMode="contain" />
          
          <View style={styles.previewControls}>
            <Pressable style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeText}>Retake</Text>
            </Pressable>

            <Pressable style={styles.saveButton} onPress={handleConfirmSave} disabled={isSaving}>
              <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const CORNER_SIZE = 10;
const CORNER_THICKNESS = 2;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5fafa',
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
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
  backButton: {
    flexDirection: 'row',
    paddingBottom: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 2,
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#d8d8d8',
  },
  camera: {
    flex: 1,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#fff',
  },
  cornerTL: {
    top: 16,
    left: 16,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  cornerTR: {
    top: 16,
    right: 16,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  cornerBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  cornerBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  captureButton: {
    width: 100,
    height: 100,
    borderRadius: 90,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#006E59',
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
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(255, 250, 250, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '80%',
    height: '70%',
    borderRadius: 20,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 24,
  },
  retakeButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 60,
    backgroundColor: '#F7BD53',
  },
  retakeText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 60,
    backgroundColor: '#006E59',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});