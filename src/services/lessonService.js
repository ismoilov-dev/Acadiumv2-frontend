import apiClient from '../api/apiClient';

const LESSONS_BASE = 'lessons';

export const lessonService = {
  list: async () => {
    const response = await apiClient.get(`${LESSONS_BASE}/`);
    const data = response.data;
    // Django pagination, plain array, yoki {data: [...]} formatini handle qiladi
    return Array.isArray(data) ? data : (data.results ?? data.data ?? []);
  },

  generate: async (data) => {
    const response = await apiClient.post(`${LESSONS_BASE}/generate/`, data);
    const resData = response.data || {};
    if (resData.lesson_id && resData.id === undefined) {
      resData.id = resData.lesson_id;
    }
    return resData;
  },

  get: async (id) => {
    const response = await apiClient.get(`${LESSONS_BASE}/${id}/`);
    return response.data;
  },

  getPublic: async (id) => {
    const response = await apiClient.get(`${LESSONS_BASE}/public/${id}/`);
    return response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`${LESSONS_BASE}/${id}/`);
  },

  update: async (id, data) => {
    const response = await apiClient.patch(`${LESSONS_BASE}/${id}/`, data);
    return response.data;
  },

  download: async (id, filename = 'lesson.pptx') => {
    const response = await apiClient.get(`${LESSONS_BASE}/${id}/download/`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  sendToTelegram: async (id) => {
    const response = await apiClient.post(`${LESSONS_BASE}/${id}/send_telegram/`);
    return response.data;
  },
};