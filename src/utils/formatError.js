export function formatError(error) {
  if (!error) return "Noma'lum xatolik";

  const data = error.response?.data;

  if (typeof data === 'string') return data;
  if (data?.detail) return data.detail;
  if (data?.error) return data.error;

  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).flatMap(([field, value]) => {
      if (Array.isArray(value)) return value.map((msg) => `${field}: ${msg}`);
      return [`${field}: ${value}`];
    });
    if (messages.length) return messages.join(', ');
  }

  return error.message || "Noma'lum xatolik";
}
