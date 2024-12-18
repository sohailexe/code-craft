import { output } from "framer-motion/client";
import { create } from "zustand";
import { LANGUAGE_CONFIG } from "../(root)/_constants";

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
    localStorage.setItem("editor-font-size", fontSize);
    set({ fontSize });
  },

  runCode: async () => {
    const { language, getCode } = get();

    const code = getCode();
    if (!code) {
      set({ error: "No code to run", output: "" });
      return;
    }

    set({ isRunning: true, error: null, output: "" });

    try {
      const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
      const response = await fetch(`https://emkc.org/api/v2/piston/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      //handle api level errors
      if (data.message) {
        set({
          error: data.message,
          executionResult: { code, output: "", error: data.message },
        });
        return;
      }

      // handle compliation errors

      if (data.compile && data.compile.code != 0) {
        const error = data.compile.stderr || data.compile.output;
        set({
          error,
          executionResult: { code, output: "", error },
        });
        return;
      }

      // handle runtime errors

      if (data.run && data.run.code !== 0) {
        const error = data.run.stderr || data.run.output;
        set({
          error,
          executionResult: {
            code,
            output: "",
            error,
          },
        });
        return;
      }

      // if we get here, execution was successful
      const output = data.run.output;

      set({
        output: output.trim(),
        error: null,
        executionResult: {
          code,
          output: output.trim(),
          error: null,
        },
      });
    } catch (error) {
      console.log("Error running code:", error);
      set({
        error: "Error running code",
        executionResult: { code, output: "", error: "Error running code" },
      });
    } finally {
      set({ isRunning: false });
    }
  },
}));
