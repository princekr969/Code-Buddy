import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { Awareness } from 'y-protocols/awareness';
import { MonacoBinding } from "y-monaco";
import { useAuthContext } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useFileSystem } from "../../context/FileContext";
import { SocketEvent } from "../../types/socket";

const languageMap = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
};

function MonacoEditor() {
  const { currentUser } = useAuthContext();
  const { activeFile, setActiveFile, setFiles, setOpenFiles, files, openFiles } = useFileSystem();
  const { socket } = useSocket();
  
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const ydocRef = useRef(null);
  const bindingRef = useRef(null);
  const providerRef = useRef(null);
  
  // State for editor readiness
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Get language based on file extension
  const getLanguage = useCallback(() => {
    if (!activeFile?.name) return "javascript";
    const ext = activeFile.name.split(".").pop().toLowerCase();
    return languageMap[ext] || "plaintext";
  }, [activeFile]);
  
  // Handle editor mount - store instances
  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);
    
    // Configure monaco options for better UX
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
      fontSize: 14,
      fontFamily: "monospace",
      lineNumbers: "on",
      renderWhitespace: "selection",
      tabSize: 2,
    });
    
    // Set up theme
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0f172a",
      },
    });
    monaco.editor.setTheme("custom-dark");
  }, []);
  
  // Set up collaborative editing with Yjs
  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !activeFile || !socket) return;
    
    // Clean up previous binding
    if (bindingRef.current) {
      bindingRef.current.destroy();
    }
    if (ydocRef.current) {
      ydocRef.current.destroy();
    }
    
    // Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    
    // Get or create text type for this file
    const ytext = ydoc.getText(`file-${activeFile._id}`);
    
    // Initialize with existing content if available
    if (ytext.toString() !== activeFile.content) {
      ytext.delete(0, ytext.length);
      ytext.insert(0, activeFile.content);
    }
    
    const awareness = new Awareness(ydoc);
    
    awareness.setLocalState({
      user: {
        name: currentUser?.username || "Anonymous",
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        id: currentUser?._id,
      },
    });
    
    // Create binding between Yjs and Monaco
    const binding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness
    );
    bindingRef.current = binding;
    
    // Handle Yjs updates and sync with socket
    const updateHandler = (update, origin) => {
      if (origin === binding) return; // Ignore own updates
      
      // Broadcast updates via socket
      socket.emit(SocketEvent.FILE_UPDATED, {
        fileId: activeFile._id,
        update: Array.from(update), // Convert Uint8Array to array for transport
      });
    };
    
    ydoc.on("update", updateHandler);
    
    // Listen for remote updates
    const handleRemoteUpdate = ({ fileId, update }) => {
      if (fileId === activeFile._id) {
        Y.applyUpdate(ydoc, new Uint8Array(update), binding);
      }
    };
    
    socket.on(SocketEvent.FILE_UPDATED, handleRemoteUpdate);
    
    // Update local file state when content changes
    const observer = () => {
      const newContent = ytext.toString();
      if (newContent !== activeFile.content) {
        const updatedFile = { ...activeFile, content: newContent };
        setActiveFile(updatedFile);
        setFiles(prev => prev.map(f => f._id === activeFile._id ? updatedFile : f));
        setOpenFiles(prev => prev.map(f => f._id === activeFile._id ? updatedFile : f));
      }
    };
    
    ytext.observe(observer);
    
    // Cleanup
    return () => {
      ytext.unobserve(observer);
      socket.off(SocketEvent.FILE_UPDATED, handleRemoteUpdate);
      ydoc.off("update", updateHandler);
      binding.destroy();
      ydoc.destroy();
    };
  }, [isEditorReady, activeFile?._id, socket, currentUser, setActiveFile, setFiles, setOpenFiles]);
  
  // Handle manual save (if needed)
  const handleSave = useCallback(async () => {
    if (!activeFile || !editorRef.current) return;
    
    const content = editorRef.current.getValue();
    
    // Emit save event to server
    socket.emit(SocketEvent.FILE_SAVED, {
      fileId: activeFile._id,
      content,
    });
    
    // Update local state
    const updatedFile = { ...activeFile, content };
    setActiveFile(updatedFile);
    setFiles(prev => prev.map(f => f._id === activeFile._id ? updatedFile : f));
    setOpenFiles(prev => prev.map(f => f._id === activeFile._id ? updatedFile : f));
  }, [activeFile, socket, setActiveFile, setFiles, setOpenFiles]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);
  
  const options = useMemo(() => ({
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
    glyphMargin: true,
    lightbulb: { enabled: true },
  }), []);
  
  if (!activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-800 text-slate-200">
        <div className="text-2xl font-semibold mb-2">No file is open</div>
        <p className="text-md mb-4">
          Select a file from the sidebar or create a new one to begin coding...
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex w-full flex-col h-full">
      <Editor
        height="100%"
        width="100%"
        language={getLanguage()}
        value={activeFile.content}
        theme="vs-dark"
        options={options}
        onMount={handleEditorDidMount}
        path={activeFile._id}
      />
      
      {activeFile.isDirty && (
        <div className="absolute bottom-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded text-sm">
          Unsaved changes
        </div>
      )}
    </div>
  );
}

export default MonacoEditor;