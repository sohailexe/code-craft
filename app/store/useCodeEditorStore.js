import { create } from "zustand";
// import { LANGUAGE_CONFIG } from "../(root)/_constants";
// import { Monaco } from "@monaco-editor/react";
// import { Code } from "lucide-react";
// import { Language } from "../types";
// import { output } from "framer-motion/client";
// import { exec } from "child_process";

const getInitialState = () => {
  if (typeof window === "undefined") {
    //if window is not defined mean runing on server side
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  const savedLanguage = localStorage.getItem("language") || "javascript";
  const savedTheme = localStorage.getItem("theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("fontSize") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

const initialState = getInitialState();

export const useCodeEditorStore = create((get, set) => ({
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
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));
