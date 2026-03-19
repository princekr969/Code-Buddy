import { useFileSystem } from "../../context/FileContext";
import { useCallback } from "react";

const getFileIcon = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  const icons = {
    js: { color: "#f7df1e", label: "JS" },
    jsx: { color: "#61dafb", label: "JSX" },
    ts: { color: "#3178c6", label: "TS" },
    tsx: { color: "#61dafb", label: "TSX" },
    py: { color: "#3572A5", label: "PY" },
    java: { color: "#b07219", label: "JV" },
    html: { color: "#e34c26", label: "HTM" },
    css: { color: "#563d7c", label: "CSS" },
    json: { color: "#cbcb41", label: "JSON" },
    md: { color: "#083fa1", label: "MD" },
    c: { color: "#555555", label: "C" },
    cpp: { color: "#f34b7d", label: "C++" },
  };
  return icons[ext] || { color: "#858585", label: "TXT" };
};

export default function EditorTabBar() {
  const { openFiles, activeFile, setActiveFile, closeFile, setOpenFiles } = useFileSystem();

  const handleTabClick = useCallback((file) => {
    setActiveFile(file);
  }, [setActiveFile]);

  const handleClose = useCallback((e, fileId) => {
    e.stopPropagation();
    closeFile(fileId);
  }, [closeFile]);

  if (!openFiles || openFiles.length === 0) return null;

  return (
    <div className="flex items-end overflow-x-auto bg-slate-950 border-b border-slate-800 scrollbar-none min-h-[35px]"
      style={{ scrollbarWidth: "none" }}
    >
      {openFiles.map((file) => {
        const isActive = activeFile?._id === file._id;
        const isDirty = file.isDirty;
        const icon = getFileIcon(file.name);

        return (
          <div
            key={file._id}
            onClick={() => handleTabClick(file)}
            className={`
              group relative flex items-center gap-1.5 px-3 min-w-[120px] max-w-[200px] h-[35px]
              cursor-pointer select-none shrink-0 border-r border-slate-800
              transition-colors duration-100
              ${isActive
                ? "bg-slate-900 text-slate-100 border-t-2 border-t-blue-500"
                : "bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-slate-300 border-t-2 border-t-transparent"
              }
            `}
          >
            {/* File type indicator dot */}
            <span
              className="w-2 h-2 rounded-full shrink-0 opacity-80"
              style={{ backgroundColor: icon.color }}
            />

            {/* Filename */}
            <span className="text-[13px] font-mono truncate flex-1">
              {file.name}
            </span>

            {/* Close / dirty indicator */}
            <button
              onClick={(e) => !isDirty && handleClose(e, file._id)}
              className={`
                shrink-0 w-4 h-4 rounded flex items-center justify-center
                transition-all duration-100
                ${isDirty
                  ? "cursor-default"
                  : "opacity-0 group-hover:opacity-100 hover:bg-slate-700"
                }
              `}
              title={isDirty ? "Unsaved changes" : "Close"}
            >
              {isDirty ? (
                <span className="w-2 h-2 rounded-full bg-slate-300 block" />
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        );
      })}

      {/* Remaining space fill */}
      <div className="flex-1 border-b border-slate-800 h-[35px]" />
    </div>
  );
}