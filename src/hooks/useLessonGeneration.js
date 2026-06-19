// src/hooks/useLessonGeneration.js
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api"; // sizning mavjud axios instance

const POLL_MS = 3000;
const MAX_MS  = 10 * 60 * 1000;

export function useLessonGeneration() {
  const [lessonId,   setLessonId]   = useState(
    () => localStorage.getItem("pending_lesson_id")
  );
  const [taskStatus, setTaskStatus] = useState(null);
  const [progress,   setProgress]   = useState(0);
  const [step,       setStep]       = useState("");
  const [lesson,     setLesson]     = useState(null);
  const [error,      setError]      = useState(null);
  const [isLoading,  setIsLoading]  = useState(false);

  const pollRef    = useRef(null);
  const startedRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const fetchLesson = useCallback(async (id) => {
    try {
      const { data } = await api.get(`/lessons/${id}/`);
      setLesson(data);
    } catch {
      setError("Dars yuklanmadi. Sahifani yangilang.");
    }
  }, []);

  const pollStatus = useCallback(async (id) => {
    if (startedRef.current && Date.now() - startedRef.current > MAX_MS) {
      stopPolling();
      localStorage.removeItem("pending_lesson_id");
      setError("Generatsiya 10 daqiqadan oshdi. Qayta urining.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get(`/lessons/${id}/status/`);
      setTaskStatus(data.status);
      setProgress(data.progress    ?? 0);
      setStep(data.current_step    ?? "");

      if (data.status === "completed") {
        stopPolling();
        localStorage.removeItem("pending_lesson_id");
        setIsLoading(false);
        await fetchLesson(id);
      } else if (data.status === "failed") {
        stopPolling();
        localStorage.removeItem("pending_lesson_id");
        setIsLoading(false);
        setError(data.error || "Xatolik yuz berdi. Qayta urining.");
      }
    } catch (err) {
      console.warn("Polling xatosi, qayta uriniladi:", err.message);
    }
  }, [stopPolling, fetchLesson]);

  const startPolling = useCallback((id) => {
    stopPolling();
    startedRef.current = Date.now();
    pollStatus(id);
    pollRef.current = setInterval(() => pollStatus(id), POLL_MS);
  }, [stopPolling, pollStatus]);

  // Sahifa yangilansa — pending task ni davom ettirish
  useEffect(() => {
    if (lessonId) {
      setIsLoading(true);
      startPolling(lessonId);
    }
    return stopPolling;
  }, []); // eslint-disable-line

  const generateLesson = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    setLesson(null);
    setProgress(0);
    setStep("");
    setTaskStatus(null);

    try {
      const { data } = await api.post("/lessons/generate/", params);
      const id = data.lesson_id;

      localStorage.setItem("pending_lesson_id", String(id));
      setLessonId(id);
      setTaskStatus("pending");
      startPolling(id);
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error  ||
        "Generatsiya boshlanmadi. Qayta urining."
      );
    }
  }, [startPolling]);

  const reset = useCallback(() => {
    stopPolling();
    localStorage.removeItem("pending_lesson_id");
    setLessonId(null);
    setTaskStatus(null);
    setProgress(0);
    setStep("");
    setLesson(null);
    setError(null);
    setIsLoading(false);
  }, [stopPolling]);

  return {
    generateLesson,
    reset,
    lessonId,
    status      : taskStatus,
    progress,
    step,
    lesson,
    error,
    isLoading,
    isPending   : taskStatus === "pending",
    isProcessing: taskStatus === "processing",
    isCompleted : taskStatus === "completed",
    isFailed    : taskStatus === "failed",
  };
}