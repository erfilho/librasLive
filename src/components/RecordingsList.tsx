import RecordingCard from "./RecordingCard";

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
  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-center lg:justify-start gap-3 flex-wrap">
      {recordings.map((rec) => (
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
  );
}
