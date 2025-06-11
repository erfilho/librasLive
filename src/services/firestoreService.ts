import { app, db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface AudioTranscription {
  userId: string;
  audioUrl: string;
  classRef: string;
  duration: string;
  transcription: string;
  translated: string;
  createdAt: Timestamp;
}

export const uploadAudioFile = async (
  audioBlob: Blob,
  filename: string
): Promise<string> => {
  try {
    const storage = getStorage(app);
    const audioRef = ref(storage, `audio/${filename}`);

    await uploadBytes(audioRef, audioBlob);

    const downloadUrl = await getDownloadURL(audioRef);

    return downloadUrl;
  } catch (error) {
    console.error("Error uploading audio file: ", error);
    throw new Error("Failed to upload audio file");
  }
};

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
