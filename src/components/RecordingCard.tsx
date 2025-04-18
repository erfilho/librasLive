import {
  DocumentTextIcon,
  CalendarDaysIcon,
  ClockIcon,
  PlayCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface RecordingCardProps {
  title: string;
  date: string;
  duration: string;
  onWatch: () => void;
  onDelete: () => void;
}

export default function RecordingCard({
  title,
  date,
  duration,
  onWatch,
  onDelete,
}: RecordingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-md border border-sky-100">
      <div className="space-y-2 text-sm text-black">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          <span>{duration}</span>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={onWatch}
          className="flex items-center gap-2 text-sm hover:underline"
        >
          <PlayCircleIcon className="h-5 w-5" />
          Assistir em Libras
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 text-sm text-red-600 hover:underline"
        >
          <TrashIcon className="h-5 w-5" />
          Excluir
        </button>
      </div>
    </div>
  );
}
