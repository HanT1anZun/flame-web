import { create } from "zustand";
import { emotionApi } from "../api/emotion";

interface EmotionState {
  inputText: string;
  selectedImage: File | null;
  imagePreviewUrl: string | null;
  isAnalyzing: boolean;
  lastResult: any | null;
  historyRecords: any[];
  historyTotal: number;

  setInputText: (text: string) => void;
  setSelectedImage: (file: File | null, previewUrl?: string | null) => void;
  analyze: (text?: string, imageFile?: File) => Promise<any>;
  loadHistory: (page: number) => Promise<void>;
  clearInput: () => void;
}

export const useEmotionStore = create<EmotionState>((set, get) => ({
  inputText: "",
  selectedImage: null,
  imagePreviewUrl: null,
  isAnalyzing: false,
  lastResult: null,
  historyRecords: [],
  historyTotal: 0,

  setInputText: (text) => set({ inputText: text }),

  setSelectedImage: (file, previewUrl) => {
    const prev = get().imagePreviewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ selectedImage: file, imagePreviewUrl: previewUrl ?? null });
  },

  analyze: async (text?: string, imageFile?: File) => {
    set({ isAnalyzing: true });
    try {
      const result = await emotionApi.analyze(text, imageFile);
      set({ lastResult: result, isAnalyzing: false });
      return result;
    } catch (e) {
      set({ isAnalyzing: false });
      throw e;
    }
  },

  loadHistory: async (page) => {
    const data = await emotionApi.getHistory(page);
    set({ historyRecords: data.records || [], historyTotal: data.total || 0 });
  },

  clearInput: () => {
    const prev = get().imagePreviewUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      inputText: "",
      selectedImage: null,
      imagePreviewUrl: null,
      lastResult: null,
    });
  },
}));
