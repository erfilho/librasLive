import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";

export interface AudioTranscription {
  userId: string;
  audioUrl: string;
  classRef: string;
  transcription: string;
  createdAt: Timestamp;
}

export const saveTranscription = async (transcription: AudioTranscription) => {
  try {
    const docRef = await addDoc(collection(db, "recorders"), transcription);
    console.log("Transcription saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving transcription: ", error);
    throw new Error("Failed to save transcription");
  }
};

export const deleteTranscription = async (id: string) => {
  try {
    const transcriptionRef = doc(db, "recorders", id);
    await deleteDoc(transcriptionRef);
    console.log("Transcription deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting transcription: ", error);
    throw new Error("Failed to delete transcription");
  }
};
