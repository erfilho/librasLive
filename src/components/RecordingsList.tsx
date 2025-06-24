import RecordingCard from "./RecordingCard";
import { DeletePopup } from "./AlertsPopups";

import { useEffect, useState } from "react";

import { useNotification } from "../context/notifications/useNotification";

import {
  deleteTranscription,
  deleteAudioFile,
  getTranscriptions,
  AudioRecorder,
} from "../services/firestoreService";

import { useAuth } from "../context/AuthContext";

const ITEMS_PER_PAGE = 16;

export default function RecordingsList() {
  const { user } = useAuth();

  const [confirmation, setConfirmation] = useState<{
    id: string;
    filename: string;
  } | null>(null);

  const { handleError } = useNotification();

  const [recordings, setRecordings] = useState<AudioRecorder[]>([]);

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
        const data = await getTranscriptions(user.uid);
        setRecordings(data || []);
      } catch (error) {
        console.error("Erro ao buscar gravações:", error);
        handleError(`Erro ao buscar gravações. Tente novamente. ${error}`);
      }
    };
    fetchRecordings();
  }, [user]);

  const handleDelete = async (id: string, filename: string) => {
    try {
      await deleteTranscription(id);
      await deleteAudioFile(filename);
      setRecordings((prev) => prev.filter((rec) => rec.id !== id));
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setConfirmation(null);
    } catch (error) {
      console.error("Erro ao excluir gravação:", error);
      handleError(`Erro ao excluir gravação. Tente novamente.${error}`);
    }
  };

  return (
    <div className="flex flex-col justify-between h-5/6">
      {/* Mostragem dos itens */}
      <div className="flex flex-col lg:flex-row w-full self-start items-center justify-center lg:justify-start gap-3 flex-wrap">
        {/* Exibição de card de confirmação de exclusão */}
        {confirmation && (
          <DeletePopup
            title="Excluir Gravação"
            message="Você tem certeza que deseja excluir esta gravação?"
            onConfirm={() =>
              handleDelete(confirmation.id, confirmation.filename)
            }
            onCancel={() => setConfirmation(null)}
          />
        )}

        {/* Exibição quando não tiver gravações para o usuário */}
        {currentItems.length === 0 ? (
          <div className="text-center text-gray-100 w-full">
            <p className="text-lg font-bold">Nenhuma gravação encontrada.</p>
            <p className="text-sm font-medium italic">
              Faça uma nova gravação para começar.
            </p>
          </div>
        ) : (
          currentItems.map((rec) => (
            <RecordingCard
              key={rec.id}
              title={rec.title}
              date={rec.date}
              duration={rec.duration}
              url={rec.url}
              onWatch={() => alert(`Assistir: ${rec.filename}`)}
              onDelete={() =>
                setConfirmation({ id: rec.id, filename: rec.filename })
              } // Passa o ID e o nome do arquivo para a confirmação
            />
          ))
        )}
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
          {currentPage} de {totalPages == 0 ? 1 : totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === (totalPages == 0 ? 1 : totalPages)}
          className="bg-blue-400 text-white px-4 py-2 rounded-r"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
