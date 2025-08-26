import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { app, db } from "@/lib/firebase";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

export interface AudioTranscription {
  userId: string;
  audioUrl: string;
  classRef: string;
  duration: string;
  filename: string;
  transcription: string;
  translated: string;
  createdAt: Timestamp;
}

export interface AudioRecorder {
  id: string;
  title: string;
  date: string;
  duration: string;
  url: string;
  filename: string;
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

export const deleteAudioFile = async (filename: string) => {
  try {
    const storage = getStorage(app);
    const audioRef = ref(storage, `audio/${filename}`);

    await deleteObject(audioRef);
    console.log("Audio file deleted: ", filename);
  } catch (error) {
    console.error("Error deleting audio file: ", error);
    throw new Error("Failed to delete audio file");
  }
};

export const getTranscriptions = async (
  userId: string
): Promise<AudioRecorder[] | undefined> => {
  try {
    const recordingsRef = collection(db, "recorders");
    const q = query(recordingsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const fetchedRecordings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().classRef,
      date: doc.data().createdAt.toDate().toLocaleDateString("pt-BR"),
      duration: doc.data().duration,
      url: doc.data().audioUrl,
      filename: doc.data().filename,
    }));
    return fetchedRecordings;
  } catch (error) {
    console.error("Erro ao buscar gravações:", error);
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
