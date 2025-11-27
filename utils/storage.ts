import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/notes';

export const getNotes = async (): Promise<Note[]> => {
  const data = await AsyncStorage.getItem('notes');
  return data ? JSON.parse(data) : [];
};

export const saveNote = async (note: Note): Promise<void> => {
  const notes = await getNotes();
  notes.push(note);
  await AsyncStorage.setItem('notes', JSON.stringify(notes));
};

export const updateNote = async (id: string, updates: Partial<Note>): Promise<void> => {
  const notes = await getNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updates };
    await AsyncStorage.setItem('notes', JSON.stringify(notes));
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  const notes = await getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  await AsyncStorage.setItem('notes', JSON.stringify(filtered));
};
