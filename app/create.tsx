import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/notes';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#CDC9A5',
  backgroundAlt: '#CDBA96',
  card: '#b49862',
  accent: '#d395abff',
  accentSoft: '#cd9f96',
  border: '#29223b',
  textPrimary: '#fff',
  textSecondary: '#b1842fff',
  textAlt: '#b49862',
  iconAccent: '#CDBA96',
};

export default function Create() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo!.uri);
      setShowCamera(false);
    }
  };

  const saveNote = async () => {
    if (!title || !description || !image) {
      Alert.alert('Completa tu nota', 'Por favor llena todos los campos');
      return;
    }

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        description,
        image,
        date: new Date().toLocaleDateString(),
      };
      const data = await AsyncStorage.getItem('notes');
      const notes = data ? JSON.parse(data) : [];
      notes.push(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
        <View style={cameraStyles.cameraOverlay}>
          <TouchableOpacity
            style={cameraStyles.captureBtn}
            onPress={takePicture}
            activeOpacity={0.85}>
            <View style={cameraStyles.captureCircle}>
              <View style={cameraStyles.captureInner} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={cameraStyles.cancelBtn}
            onPress={() => setShowCamera(false)}
            activeOpacity={0.85}>
            <Ionicons name="close" size={28} color="#fff" />
            <Text style={cameraStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/')} 
          style={styles.backButton}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Capturá tus ideas</Text>
      
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="sparkles" size={16} color={COLORS.accent} />
            <Text style={styles.label}>Título</Text>
          </View>
          <TextInput
            style={styles.header}
            placeholder="Dale un nombre especial..."
            placeholderTextColor={COLORS.textAlt}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="create" size={16} color={COLORS.accent} />
            <Text style={styles.label}>Descripción</Text>
          </View>
          <TextInput
            style={styles.header}
            placeholder="Contanos más sobre esta nota..."
            placeholderTextColor={COLORS.textAlt}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.photoSection}>
          <View style={styles.labelRow}>
            <Ionicons name="image" size={16} color={COLORS.accent} />
            <Text style={styles.label}>Fotografía</Text>
          </View>
          
          {image ? (
            <View style={styles.header}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.header}
                onPress={openCamera}
                activeOpacity={0.85}>
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.changePhotoText}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.photoPlaceholder}
              onPress={openCamera}
              activeOpacity={0.85}>
              <View style={styles.photoIconCircle}>
                <Ionicons name="camera-outline" size={36} color={COLORS.accent} />
              </View>
              <Text style={styles.photoPlaceholderTitle}>Tomar fotografía</Text>
              <Text style={styles.photoPlaceholderText}>
                Agregá una imagen a tu nota
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveNote}
        activeOpacity={0.85}>
        <Ionicons name="heart" size={22} color="#fff" />
        <Text style={styles.saveBtnText}>Guardar mi nota</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    backgroundColor: COLORS.backgroundAlt,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  inputDesc: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 120,
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  photoSection: {
    marginBottom: 24,
  },
  photoPlaceholder: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 20,
    paddingVertical: 48,
    alignItems: 'center',
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  photoIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  imagePreviewContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  imagePreview: {
    width: '100%',
    height: 240,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accentSoft,
    paddingVertical: 14,
  },
  changePhotoText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const cameraStyles = StyleSheet.create({
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  },
  captureBtn: {
    marginBottom: 20,
  },
  captureCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
