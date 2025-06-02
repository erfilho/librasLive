import RecordingCard from "./RecordingCard";

import { useEffect, useState } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const ITEMS_PER_PAGE = 16;

export default function RecordingsList() {
  const { user } = useAuth();

  const [recordings, setRecordings] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(recordings.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = recordings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Efeito para buscar gravações do Firestore ( ainda em desenvolvimento )
  useEffect(() => {
    const fetchRecordings = async () => {
      if (!user) return;

      try {
        const recordingsRef = collection(db, "recorders");
        const q = query(recordingsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedRecordings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().classRef,
          date: doc.data().createdAt.toDate().toLocaleDateString("pt-BR"),
          duration: doc.data().transcription,
        }));
        setRecordings(fetchedRecordings);
      } catch (error) {
        console.error("Erro ao buscar gravações:", error);
      }
    };
    fetchRecordings();
  }, [user]);

  return (
    <div className="flex flex-col justify-between h-5/6">
      {/* Mostragem dos itens */}
      <div className="flex flex-col lg:flex-row w-full self-start items-center justify-center lg:justify-start gap-3 flex-wrap">
        {currentItems.map((rec) => (
          <RecordingCard
            key={rec.id}
            title={rec.title}
            date={rec.date}
            duration={rec.duration}
            onWatch={() => alert(`Assistir: ${rec.title}`)}
            onDelete={() => alert(`Excluir: ${rec.title}`)}
          />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-blue-400 text-white px-4 py-2 rounded-l"
        >
          Anterior
        </button>
        <span className="px-4 py-2 bg-blue-400 text-white">
          {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-400 text-white px-4 py-2 rounded-r"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
