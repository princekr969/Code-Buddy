import { useState } from "react";
import { Play, Square, ChevronDown, ChevronUp } from "lucide-react";
import { useExecuteCode } from "../../context/ExecuteCodeContext";
import { useFileSystem } from "../../context/FileContext";

export default function RunPanel() {
  const { activeFile } = useFileSystem();
  const {
    setInput,
    output,
    isRunning,
    supportedLanguages,
    selectedLanguage,
    setSelectedLanguage,
    isError,
    executeCode,
  } = useExecuteCode();

  const [showStdin, setShowStdin] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [stdinValue, setStdinValue] = useState("");

  const handleStdinChange = (e) => {
    setStdinValue(e.target.value);
    setInput(e.target.value);
  };

  return (
    <div className="h-full bg-slate-950 border-r-2 border-gray-700 text-white w-64 flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-semibold text-sm">Run Code</h3>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
        
        <div className="bg-slate-900 rounded p-2 text-xs">
          {activeFile ? (
            <>
              <div className="text-slate-400">File:</div>
              <div className="text-slate-200 font-mono truncate mt-0.5">
                {activeFile.name}
              </div>
            </>
          ) : (
            <div className="text-slate-400">No file open</div>
          )}
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguages((p) => !p)}
            className="w-full flex items-center justify-between bg-slate-900 
                       border border-slate-700 rounded px-2 py-1.5 text-xs
                       hover:border-slate-500 transition-colors"
          >
            <span
              className={
                selectedLanguage.id ? "text-slate-200" : "text-slate-500"
              }
            >
              {selectedLanguage.name || "Auto-detected / Select language"}
            </span>
            {showLanguages ? (
              <ChevronUp size={12} className="text-slate-400 shrink-0" />
            ) : (
              <ChevronDown size={12} className="text-slate-400 shrink-0" />
            )}
          </button>

          {showLanguages && (
            <div
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-slate-800 
                            border border-slate-700 rounded shadow-xl max-h-48 overflow-y-auto"
            >
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage({
                      id: lang.id,
                      name: lang.name,
                      language: lang.language, 
                      version: lang.version, 
                    });
                    setShowLanguages(false);
                  }}
                  className={`
                    w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 transition-colors
                    ${selectedLanguage.id === lang.id ? "text-blue-400" : "text-slate-300"}
                  `}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowStdin((p) => !p)}
            className="flex items-center gap-1 text-xs text-slate-400 
                       hover:text-slate-200 transition-colors w-full"
          >
            {showStdin ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Standard Input (stdin)
          </button>

          {showStdin && (
            <textarea
              value={stdinValue}
              onChange={handleStdinChange}
              placeholder="Enter input here..."
              className="mt-2 w-full h-20 bg-slate-900 text-slate-200 text-xs font-mono
                         border border-slate-700 rounded p-2 resize-none
                         focus:outline-none focus:border-slate-500 placeholder-slate-600"
            />
          )}
        </div>

        <button
          onClick={executeCode}
          disabled={isRunning || !activeFile}
          className={`
            flex items-center justify-center gap-2 w-full py-2 rounded 
            text-sm font-medium transition-all duration-150
            ${
              isRunning || !activeFile
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 text-white cursor-pointer"
            }
          `}
        >
          {isRunning ? (
            <>
              <Square size={14} className="animate-pulse" />
              Running...
            </>
          ) : (
            <>
              <Play size={14} />
              Run
            </>
          )}
        </button>

        {output && (
          <div className="flex-1 flex flex-col min-h-0">
            <div
              className={`text-xs mb-1 ${isError ? "text-red-400" : "text-slate-400"}`}
            >
              {isError ? "Error" : "Output"}
            </div>
            <div
              className={`
                flex-1 overflow-y-auto bg-slate-900 rounded p-2 
                font-mono text-xs whitespace-pre-wrap break-words 
                min-h-[80px] border
                ${
                  isError
                    ? "border-red-800 text-red-400"
                    : "border-slate-700 text-white"
                }
              `}
            >
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
