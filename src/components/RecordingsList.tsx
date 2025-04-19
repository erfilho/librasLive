import RecordingCard from "./RecordingCard";

import { useState } from "react";

const ITEMS_PER_PAGE = 16;

const recordings = [
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
  {
    id: 1,
    title: "Palestra sobre Acessibilidade",
    date: "10/04/2025",
    duration: "34m 05s",
  },
  {
    id: 2,
    title: "Inclusão Digital",
    date: "08/04/2025",
    duration: "22m 48s",
  },
];

export default function RecordingsList() {
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
