export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-red-800 underline hover:no-underline"
        >
          Qayta urinish
        </button>
      )}
    </div>
  );
}
