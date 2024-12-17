import { create } from "zustand";

const getInitialState = () => {
  if (typeof window === "undefined") {
    // If window is not defined (running on server side)
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  const savedLanguage = localStorage.getItem("language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("fontSize") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

const initialState = getInitialState();

export const useCodeEditorStore = create((set, get) => ({
  ...initialState,
  output: "",
  isRunning: false,
  error: null,
  editor: null,
  executionResult: null,

  getCode: () => get().editor?.getValue() || "",
  setEditor: (editor) => {
    const savedCode = localStorage.getItem(`editor-code-${get().language}`);
    if (savedCode) {
      editor.setValue(savedCode);
    }
    set({ editor });
  },

  setTheme: (theme) => {
    localStorage.setItem("editor-theme", theme);
    set({ theme });
  },
  setLanguage: (language) => {
    localStorage.setItem("language", language);
    set({ language });
  },
  setFontSize: (fontSize) => {
    console.log(fontSize);

    localStorage.setItem("editor-font-size", fontSize);
    set({ fontSize });
  },
}));
