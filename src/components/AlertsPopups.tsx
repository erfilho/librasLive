interface AlertsPopupsProps {
  title?: string;
  type: string;
  message: string;
}

interface DeletePopupProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AlertsPopups({ title, type, message }: AlertsPopupsProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start self-start">
      {type == "error" ? (
        <div
          className="p-4 my-4 text-sm flex flex-col justify-center items-center text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">
            {title} <br />{" "}
          </span>{" "}
          {message}
        </div>
      ) : (
        <div
          className="p-4 my-4 text-sm flex flex-col justify-center items-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">
            {title} <br />{" "}
          </span>{" "}
          {message} <br />
        </div>
      )}
    </div>
  );
}

export function DeletePopup({
  title,
  message,
  onConfirm,
  onCancel,
}: DeletePopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="p-6 w-[90%] max-w-md text-center rounded-xl shadow-lg text-red-800 bg-white dark:bg-gray-900 dark:text-red-400"
        role="alert"
      >
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-around mt-4 space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
