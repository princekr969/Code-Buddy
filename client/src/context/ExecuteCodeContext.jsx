import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import CodeExecuteService from "../services/codeExecuteService";
import langMap from "lang-map";
import { useFileSystem } from "./FileContext";

const ExecuteCodeContext = createContext(null);

export const useExecuteCode = () => {
  const cxt = useContext(ExecuteCodeContext);
  if (cxt === null) {
    throw new Error("useExecuteCode must be used within a ExecuteCodeContextProvider");
  }
  return cxt;
};

const ExecuteCodeContextProvider = ({ children }) => {
  const codeExecuteService = useRef(new CodeExecuteService()).current;
  const inputRef = useRef("");

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState({
    id: null, name: "", language: "", version: "",
  });
  const [isError, setIsError] = useState(false);

  const { activeFile } = useFileSystem();

  const extMap = {
  py:     "python",
  js:     "javascript",
  ts:     "typescript",
  java:   "java",
  c:      "c",
  cpp:    "c++",
  cs:     "csharp",
  go:     "go",
  rs:     "rust",
  rb:     "ruby",
  php:    "php",
  swift:  "swift",
  kt:     "kotlin",
  sh:     "bash",
  lua:    "lua",
  hs:     "haskell",
  scala:  "scala",
  dart:   "dart",
  pl:     "perl",
  r:      "rscript",
  jl:     "julia",
  sql:    "sqlite3",
  groovy: "groovy",
  ex:     "elixir",
  pas:    "pascal",
};

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await codeExecuteService.getSupportedLanguages();
        setSupportedLanguages(res.result);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch languages");
      }
    };
    fetchLanguages();
  }, []);


useEffect(() => {
  if (supportedLanguages.length === 0 || !activeFile?.name) return;

  const ext = activeFile.name.split(".").pop()?.toLowerCase();
  const pistonLang = extMap[ext];

  if (!pistonLang) {
    setSelectedLanguage({ id: null, name: "", language: "", version: "" });
    return;
  }

  const matches = supportedLanguages.filter((l) => l.language === pistonLang);
  if (matches.length === 0) return;

  const latest = matches.sort((a, b) =>
    b.version.localeCompare(a.version, undefined, { numeric: true })
  )[0];

  setSelectedLanguage({
    id: latest.id,
    name: latest.name,
    language: latest.language,
    version: latest.version,
  });
}, [activeFile?.name, supportedLanguages]);

  const setInput = useCallback((val) => {
    inputRef.current = val;
  }, []);

  const executeCode = useCallback(async () => {
    if (!selectedLanguage.language) {
      return toast.error("Please select a language");
    }
    if (!activeFile) {
      return toast.error("Please open a file to run the code");
    }

    const toastId = toast.loading("Running code...");
    setIsRunning(true);
    setOutput("");
    setIsError(false);
    const code = activeFile.content;
    console.log("code",code)
    
    try {
      const res = await codeExecuteService.executeCode(
        activeFile.content,
        selectedLanguage.language,
        selectedLanguage.version,
        inputRef.current,
      );

      if (res.success) {
        setIsError(false);
        setOutput(res.output || "(no output)");
      } else {
        setIsError(true);
        setOutput(res.error || "Execution failed");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setOutput("Failed to connect to execution server");
      toast.error("Failed to run the code");
    } finally {
      setIsRunning(false);
      toast.dismiss(toastId);
    }
  }, [activeFile, selectedLanguage]);

  return (
    <ExecuteCodeContext.Provider
      value={{
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        isError,
        executeCode,
      }}
    >
      {children}
    </ExecuteCodeContext.Provider>
  );
};

export { ExecuteCodeContextProvider };
export default ExecuteCodeContext;