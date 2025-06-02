import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export interface AudioTranscription {
  userId: string;
  audioUrl: string;
  classRef: string;
  transcription: string;
  createdAt: Timestamp;
}

export const saveTranscription = async (transcription: AudioTranscription) => {
  try {
    const docRef = await addDoc(
      collection(db, "recorders"),
      transcription
    );
    console.log("Transcription saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving transcription: ", error);
    throw new Error("Failed to save transcription");
  }
};
