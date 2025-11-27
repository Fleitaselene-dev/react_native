import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
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

export default function Index() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem('notes');
      if (data) setNotes(JSON.parse(data));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerDecoration} />
        <Text style={styles.title}>Mis Notas</Text>
        <Text style={styles.subtitle}>
          {notes.length === 0
            ? 'Comenzá a escribir tus ideas'
            : `${notes.length} ${notes.length === 1 ? 'nota guardada' : 'notas guardadas'}`}
        </Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.textAlt} />
          <TextInput
            placeholder="Buscar en mis notas..."
            placeholderTextColor={COLORS.textAlt}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.textAlt} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredNotes}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCardTouch}
            onPress={() => router.push(`/note/${item.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.noteCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.noteImage} />
                <View style={styles.imageOverlay} />
              </View>
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.noteDescription} numberOfLines={3}>
                  {item.description}
                </Text>
                <View style={styles.noteFooter}>
                  <View style={styles.dateTag}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.textPrimary} />
                    <Text style={styles.noteDate}>{item.date}</Text>
                  </View>
                  <View style={styles.heartIcon}>
                    <Ionicons name="heart" size={14} color={COLORS.accent} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyTitle}>Tu espacio personal</Text>
            <Text style={styles.emptyMessage}>
              Creá tu primera nota y comenzá a organizar tus pensamientos
            </Text>
           
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => router.push('/create')}
        style={styles.fab}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
    backgroundColor: COLORS.backgroundAlt,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.accent,
    opacity: 0.15,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textAlt,
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  searchWrapper: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundAlt,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  noteCardTouch: {
    width: '48%',
    marginBottom: 16,
  },
  noteCard: {
    borderRadius: 24,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    shadowColor: COLORS.border,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  noteImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.accent,
    opacity: 0.08,
  },
  noteContent: {
    padding: 16,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  noteDescription: {
    fontSize: 13,
    color: COLORS.textPrimary,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  noteDate: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  heartIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyList: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
