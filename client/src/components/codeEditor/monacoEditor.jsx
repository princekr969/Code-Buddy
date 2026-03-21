  import { useEffect, useRef, useState, useCallback, useMemo } from "react";
  import Editor from "@monaco-editor/react";
  import * as Y from "yjs";
  import { Awareness } from "y-protocols/awareness";
  import { MonacoBinding } from "y-monaco";
  import { useAuthContext } from "../../context/AuthContext";
  import { useSocket } from "../../context/SocketContext";
  import { useFileSystem } from "../../context/FileContext";
  import { SocketEvent } from "../../types/socket";
  import EditorTabBar from "./EditorTabBar";

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
    const {
      activeFile,
      setActiveFile,
      setFiles,
      setOpenFiles,
      files,
      openFiles,
    } = useFileSystem();
    const { socket, isConnected } = useSocket();

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const ydocRef = useRef(null);
    const bindingRef = useRef(null);
    const providerRef = useRef(null);
    const isConnectedRef = useRef(isConnected);
    const activeFileRef = useRef(activeFile);
    const [isEditorReady, setIsEditorReady] = useState(false);
    // At the top of your component, add a map ref:
    const ydocsMapRef = useRef(new Map());
    const awarenessMapRef = useRef(new Map());

    // Generate a stable client ID from user's _id (optional but recommended)
    const clientIdRef = useRef(null);
    if (!clientIdRef.current && currentUser?._id) {
      clientIdRef.current =
        parseInt(currentUser._id.slice(-8), 16) ||
        Math.floor(Math.random() * 2 ** 32);
    }

    const userColorRef = useRef(
        `hsl(${Math.random() * 360}, 70%, 50%)`
      );
      

    useEffect(() => {
      activeFileRef.current = activeFile;
    }, [activeFile]);

    useEffect(() => {
      isConnectedRef.current = isConnected;
    }, [isConnected]);

    const getLanguage = useCallback(() => {
      if (!activeFile?.name) return "javascript";
      const ext = activeFile.name.split(".").pop().toLowerCase();
      return languageMap[ext] || "plaintext";
    }, [activeFile]);

    const handleEditorDidMount = useCallback((editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      setIsEditorReady(true);

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

      monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#020617",
        },
      });
      monaco.editor.setTheme("custom-dark");
    }, []);

  useEffect(() => {
    if (!isEditorReady || !editorRef.current || !activeFile || !socket) return;

    if (activeFile._id?.startsWith("temp-")) {
    console.log("Skipping Yjs setup for temp file:", activeFile._id);
    return;
  }

    // ── Yjs doc setup ─────────────────────────────────────────────────────
    let ydoc;
    if (!ydocsMapRef.current.has(activeFile._id)) {
      ydoc = new Y.Doc();
      ydocsMapRef.current.set(activeFile._id, ydoc);
    } else {
      ydoc = ydocsMapRef.current.get(activeFile._id);
    }

    const ytext = ydoc.getText("content");
    ydocRef.current = ydoc;

    socket.emit(SocketEvent.REQUEST_FILE_SYNC, { fileId: activeFile._id });

    // ── Awareness setup ───────────────────────────────────────────────────
    let awareness;
    if (!awarenessMapRef.current.has(activeFile._id)) {
      awareness = new Awareness(ydoc);
      awarenessMapRef.current.set(activeFile._id, awareness);
    } else {
      awareness = awarenessMapRef.current.get(activeFile._id);
    }


    awareness.setLocalState({
      user: {
        name: currentUser?.name || "Anonymous",
        color: userColorRef.current,
        id: currentUser?._id,
      },
    });


    // ── Remote cursor rendering ───────────────────────────────────────────
    let currentDecorationIds = [];

    const renderRemoteCursors = () => {
    if (!editorRef.current || !monacoRef.current) return;

    const states = awareness.getStates();
    const decorations = [];

    states.forEach((state, clientId) => {
      if (clientId === awareness.clientID) return;
      if (!state?.cursor || !state?.user) return;

      // ✅ Correctly destructure cursor and user from state
      const { cursor, user } = state;
      const { anchor, head } = cursor;

      const startLine = (anchor?.line ?? 0) + 1;
      const startCh   = (anchor?.ch   ?? 0) + 1;
      const endLine   = (head?.line   ?? 0) + 1;
      const endCh     = (head?.ch     ?? 0) + 1;
      const color     = user.color || "#00ff00";
      const name      = user.name  || "Anonymous";

      // Cursor caret
      decorations.push({
        range: new monacoRef.current.Range(endLine, endCh, endLine, endCh + 1),
        options: {
          className: `remote-cursor-${clientId}`,
          stickiness:
            monacoRef.current.editor.TrackedRangeStickiness
              .NeverGrowsWhenTypingAtEdges,
        },
      });

      // Selection highlight
      if (startLine !== endLine || startCh !== endCh) {
        decorations.push({
          range: new monacoRef.current.Range(startLine, startCh, endLine, endCh),
          options: {
            className: `remote-selection-${clientId}`,
            stickiness:
              monacoRef.current.editor.TrackedRangeStickiness
                .NeverGrowsWhenTypingAtEdges,
          },
        });
      }

      // Inject per-user CSS once
      const styleId = `cursor-style-${clientId}`;
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
    .remote-cursor-${clientId} {
      position: relative;
      border-left: 2px solid ${color};
      margin-left: -1px;
      pointer-events: none;
    }
    .remote-cursor-${clientId}::before {
      content: '${name}';
      position: absolute;
      top: -18px;
      left: -1px;
      background: ${color};
      color: white;
      font-size: 11px;
      line-height: 14px;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1000;
      font-family: sans-serif;
    }
    .remote-selection-${clientId} {
      background: ${color}33;
    }
  `;
        document.head.appendChild(style);
      }
    });

    currentDecorationIds = editorRef.current.deltaDecorations(
      currentDecorationIds,
      decorations,
    );
  };

    // ── Outgoing awareness (local → server) ───────────────────────────────
    const awarenessUpdateEmitHandler = ({ added, updated, removed }) => {
      const changedClients = [...added, ...updated, ...removed];
      const states = awareness.getStates();
      const awarenessStates = [];

      changedClients.forEach((clientId) => {
        const state = states.get(clientId);
        if (state) awarenessStates.push({ clientId, state });
      });

      if (awarenessStates.length === 0) return;

      socket.emit(SocketEvent.AWARENESS_UPDATE, {
        fileId: activeFile._id,
        states: awarenessStates,
      });
    };

    awareness.on("update", awarenessUpdateEmitHandler);

    // ── Incoming awareness (server → local) ───────────────────────────────
    const handleAwarenessUpdate = ({ fileId, states }) => {
      if (fileId !== activeFile._id) return;
      console.log("Received awareness states:", states)

      const added = [];
      const updated = [];

      states.forEach(({ clientId, state }) => {
        if (clientId === awareness.clientID) return;
        const isNew = !awareness.states.has(clientId);
        awareness.states.set(clientId, state);
        if (isNew) added.push(clientId);
        else updated.push(clientId);
      });

      // Only emit "change" NOT "update" to avoid re-triggering
      // awarenessUpdateEmitHandler and causing an infinite socket loop
      setTimeout(() => {
        awareness.emit("change", [{ added, updated, removed: [] }, "remote"]);
        renderRemoteCursors();
      }, 0);
    };

    socket.on(SocketEvent.AWARENESS_UPDATE, handleAwarenessUpdate);

    const handleUserLeft = ({user}) => {
    if (!user._id) return;

    const states = awareness.getStates();

    states.forEach((state, clientId) => {
      if (clientId === awareness.clientID) return;

      if (state?.user?.id === user._id) {
        awareness.states.delete(clientId);
        document.getElementById(`cursor-style-${clientId}`)?.remove();
      }
    });

    setTimeout(renderRemoteCursors, 0);
  };


  socket.on(SocketEvent.USER_LEFT, handleUserLeft);

  const handleFileSaved = ({ fileId, content }) => {
  const currentFile = activeFileRef.current;
  if (fileId !== currentFile?._id) return;

  const savedFile = { ...currentFile, content, isDirty: false };
  setActiveFile(savedFile);
  setFiles((prev) => prev.map((f) => (f._id === fileId ? { ...f, content, isDirty: false } : f)));
  setOpenFiles((prev) => prev.map((f) => (f._id === fileId ? { ...f, content, isDirty: false } : f)));
};

socket.on(SocketEvent.FILE_SAVED, handleFileSaved);

    const model = editorRef.current.getModel();
    if (!model) {
      console.warn("Model not ready, retrying...");
      return;
    }

    const binding = new MonacoBinding(
      ytext,
      model,
      new Set([editorRef.current]),
      null,
    );
    bindingRef.current = binding;


    // ── Local cursor tracking → awareness ─────────────────────────────────
    let cursorUpdateTimer = null;

    const cursorDisposable = editorRef.current.onDidChangeCursorSelection((e) => {
      if (cursorUpdateTimer) clearTimeout(cursorUpdateTimer);
      cursorUpdateTimer = setTimeout(() => {
        const s = e.selection;
        awareness.setLocalStateField("cursor", {
          anchor: { line: s.startLineNumber - 1, ch: s.startColumn - 1 },
          head:   { line: s.endLineNumber   - 1, ch: s.endColumn   - 1 },
        });
        cursorUpdateTimer = null;
      }, 0);
    });

    // Re-render remote cursors on any awareness change
    const awarenessChangeHandler = () => setTimeout(renderRemoteCursors, 0);
    awareness.on("change", awarenessChangeHandler);

    // ── Yjs update handler (local edits → server) ─────────────────────────
    const updateHandler = (update, origin) => {
      if (origin !== binding) return;

       const currentFile = activeFileRef.current;
      if (currentFile && !currentFile.isDirty) {
        const dirtyFile = { ...currentFile, isDirty: true };
        setActiveFile(dirtyFile);
        setFiles((prev) => prev.map((f) => (f._id === currentFile._id ? dirtyFile : f)));
        setOpenFiles((prev) => prev.map((f) => (f._id === currentFile._id ? dirtyFile : f)));
      }

      if (isConnectedRef.current) {
        socket.emit(SocketEvent.FILE_UPDATED, {
          fileId: activeFile._id,
          update: Array.from(update),
          senderId: currentUser?._id,
        });
      } else {
        console.warn("Socket not connected, cannot emit");
      }
    };

    ydoc.on("update", updateHandler);

    // ── Remote file updates (server → local) ──────────────────────────────
    const handleRemoteUpdate = ({ fileId, update }) => {
      if (fileId === activeFile._id) {
        Y.applyUpdate(ydocRef.current, new Uint8Array(update));
      }
    };

    socket.on(SocketEvent.FILE_UPDATED, handleRemoteUpdate);

    // ── Full sync on join ──────────────────────────────────────────────────
    const handleFullSync = ({ fileId, state }) => {
      if (fileId === activeFile._id) {
        Y.applyUpdate(ydocRef.current, new Uint8Array(state));
      }
    };

    socket.on(SocketEvent.FILE_SYNC, handleFullSync);

    // ── Ytext observer (keep React state in sync) ─────────────────────────
    const observer = () => {
      const newContent = ytext.toString();
      const currentFile = activeFileRef.current;

      if (newContent !== currentFile.content) {
        const updatedFile = { ...currentFile, content: newContent };
        setActiveFile(updatedFile);
        setFiles((prev) =>
          prev.map((f) => (f._id === currentFile._id ? updatedFile : f)),
        );
        setOpenFiles((prev) =>
          prev.map((f) => (f._id === currentFile._id ? updatedFile : f)),
        );
      }
    };

    ytext.observe(observer);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      if (cursorUpdateTimer) clearTimeout(cursorUpdateTimer);

      ytext.unobserve(observer);
      ydoc.off("update", updateHandler);

      socket.off(SocketEvent.FILE_SYNC, handleFullSync);
      socket.off(SocketEvent.FILE_UPDATED, handleRemoteUpdate);
      socket.off(SocketEvent.AWARENESS_UPDATE, handleAwarenessUpdate);
      socket.off(SocketEvent.USER_LEFT, handleUserLeft);
      socket.off(SocketEvent.FILE_SAVED, handleFileSaved);

      awareness.off("update", awarenessUpdateEmitHandler);
      awareness.off("change", awarenessChangeHandler);

      cursorDisposable.dispose();

      // Clear cursor decorations from editor
      if (editorRef.current) {
        editorRef.current.deltaDecorations(currentDecorationIds, []);
      }

      // Remove injected cursor styles
      awareness.getStates().forEach((_, clientId) => {
        document.getElementById(`cursor-style-${clientId}`)?.remove();
      });

      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, [
    isEditorReady,
    activeFile?._id,
    socket,
    currentUser,
    setActiveFile,
    setFiles,
    setOpenFiles,
  ]);

  const handleSave = useCallback(async () => {
  if (!activeFile || !editorRef.current) return;

  const content = editorRef.current.getValue();

  socket.emit(SocketEvent.SAVE_FILE, {
    fileId: activeFile._id,
    content,
  });
}, [activeFile, socket]);

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

    const options = useMemo(
      () => ({
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: "line",
        automaticLayout: true,
        glyphMargin: true,
        lightbulb: { enabled: true },
      }),
      [],
    );

    if (!activeFile) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-200">
          <div className="text-2xl font-semibold mb-2">No file is open</div>
          <p className="text-md mb-4">
            Select a file from the sidebar or create a new one to begin coding...
          </p>
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col h-full">
        <EditorTabBar />
        <Editor
          height="100%"
          width="100%"
          language={getLanguage()}
          theme="vs-dark"
          options={options}
          onMount={handleEditorDidMount}
        />

      </div>  
    );
  }

  export default MonacoEditor;
