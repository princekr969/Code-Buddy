import { useState, useEffect, useRef } from "react";
import { useFileSystem } from "../../context/FileContext";
import { motion, AnimatePresence } from "framer-motion";
import { File, Trash2, Edit3, Plus, Upload, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function FileExplorer() {
  const { files, activeFile, createFile, deleteFile, renameFile, openFile } =
    useFileSystem();

  const fileInputRef = useRef(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

  const handleRename = (file) => {
    setRenamingId(file._id);
    setNewName(file.name);
  };

  const submitRename = (file) => {
    if (newName.trim() && newName !== file.name) {
      renameFile(file._id, newName);
    }
    setRenamingId(null);
  };

  const handleDelete = (file) => {
    if (confirm(`Delete ${file.name}?`)) {
      deleteFile(file._id);
    }
  };

  const handleCreateFile = () => {
    const name = prompt(
      "Enter file name (including extension, e.g., script.js):"
    );
    if (name) {
      createFile({ name, content: "" });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of selectedFiles) {
      try {
        const content = await readFileAsText(file);
        await createFile({ name: file.name, content });
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        errorCount++;
      }
    }

    setIsUploading(false);
    if (errorCount === 0) {
      toast.success(`Successfully uploaded ${successCount} file(s).`);
    } else {
      toast.error(`Uploaded ${successCount} file(s), ${errorCount} failed.`);
    }
    event.target.value = "";
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e.target.error);
      reader.readAsText(file);
    });
  };

  const handleDownloadCode = () => {
    if (!activeFile) {
      toast.error("No file open to download.");
      return;
    }
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${activeFile.name}`);
  };

  return (
    <div className="w-64 h-full bg-slate-950 border-r border-gray-700 flex flex-col text-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Files
        </span>
        <button
          onClick={handleCreateFile}
          className="p-1 hover:bg-gray-700 rounded"
          title="New File"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sortedFiles.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">
            No files yet. Create or upload one.
          </div>
        ) : (
          sortedFiles.map((file) => (
            <div key={file._id}>
              <div
                className={`flex items-center py-1 px-2 hover:bg-gray-700/50 rounded group cursor-pointer ${
                  activeFile?._id === file._id ? "bg-gray-700" : ""
                }`}
                onClick={() => openFile(file._id)}
              >
                <File size={16} className="mr-2 text-blue-400 flex-shrink-0" />

                {renamingId === file._id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => submitRename(file)}
                    onKeyDown={(e) => e.key === "Enter" && submitRename(file)}
                    className="bg-gray-800 text-white px-1 py-0.5 rounded outline-none ring-1 ring-blue-500 w-full"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="flex-1 text-sm text-gray-200 truncate">
                    {file.name}
                  </span>
                )}

                <div className="hidden group-hover:flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(file);
                    }}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Rename"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-700 flex flex-col gap-2">
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition disabled:opacity-50"
        >
          <Upload size={16} />
          {isUploading ? "Uploading..." : "Open File"}
        </button>
        <button
          onClick={handleDownloadCode}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition"
        >
          <Download size={16} />
          Download Code
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
        accept=".js,.py,.java,.cpp,.txt,.md,.ts,.tsx,.json,.html,.css"
      />
    </div>
  );
}