import { useState, useEffect } from "react";
import { useFileSystem } from "../../context/FileContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  MoreVertical,
  Trash2,
  Edit3,
  Plus,
  FilePlus,
  FolderPlus,
} from "lucide-react";

const buildTree = (files) => {
  const root = { name: "root", type: "folder", children: [], path: "" };
  const pathMap = { "": root };
  console.log("file", files);

  files.forEach((file) => {
    const parts = file.name.split("/").filter(Boolean);
    let currentPath = "";
    let currentNode = root;

    // Create folder nodes for each part except the last (file name)
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap[currentPath]) {
        const folderNode = {
          id: `folder-${currentPath}`,
          name: part,
          type: "folder",
          path: currentPath,
          children: [],
          isOpen: false, // default closed
        };
        pathMap[currentPath] = folderNode;
        pathMap[parentPath].children.push(folderNode);
      }
      currentNode = pathMap[currentPath];
    }

    // Add file node
    const fileName = parts[parts.length - 1];
    const fileNode = {
      ...file,
      id: file._id,
      name: fileName,
      type: "file",
      path: file.path,
    };
    currentNode.children.push(fileNode);
  });

  return root.children; // return top-level items
};

export default function FileExplorer() {
  const {
    files,
    activeFile,
    createFile,
    deleteFile,
    renameFile, 
    openFile,
  } = useFileSystem();

  const [tree, setTree] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [newItemType, setNewItemType] = useState(null); // 'file' or 'folder'

  // Rebuild tree when files change
  useEffect(() => {
    setTree(buildTree(files));
  }, [files]);

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleRename = (item) => {
    setRenamingId(item.id);
    setNewName(item.name);
  };

  const submitRename = (item) => {
    if (newName.trim() && newName !== item.name) {
      // Update the file's path or name – depends on your data model
      const newPath = item.path.replace(/[^/]+$/, newName);
      renameFile(item.id, newPath);
    }
    setRenamingId(null);
  };

  const handleDelete = (item) => {
    if (confirm(`Delete ${item.name}?`)) {
      deleteFile(item.id);
    }
  };

  const handleCreate = (type) => {
    setNewItemType(type);
    setShowNewMenu(false);
    // You could prompt for name in a modal or inline input
    const name = prompt(`Enter ${type} name:`);
    if (name) {
      // Determine parent folder from currently selected/expanded folder
      const parentPath = ""; // simplify: create at root for now
      const fullPath = parentPath ? `${parentPath}/${name}` : name;
      createFile({
        name: fullPath,
        content: "",
        type: type, // if you want to distinguish folders
      });
    }
  };

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-700/50 rounded group cursor-pointer ${
            activeFile?._id === node.id ? "bg-gray-700" : ""
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
          onClick={() => node.type === "file" && openFile(node.id)}
        >
          {/* Expand/collapse for folders */}
          {node.type === "folder" ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.path);
              }}
              className="mr-1 text-gray-400 hover:text-white"
            >
              {expandedFolders[node.path] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          ) : (
            <span className="w-5 mr-1" /> // spacer for alignment
          )}

          {/* Icon */}
          <span className="mr-2">
            {node.type === "folder" ? (
              expandedFolders[node.path] ? (
                <FolderOpen size={16} className="text-yellow-400" />
              ) : (
                <Folder size={16} className="text-yellow-400" />
              )
            ) : (
              <File size={16} className="text-blue-400" />
            )}
          </span>

          {/* Name with inline rename input */}
          {renamingId === node.id ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => submitRename(node)}
              onKeyDown={(e) => e.key === "Enter" && submitRename(node)}
              className="bg-gray-800 text-white px-1 py-0.5 rounded outline-none ring-1 ring-blue-500 w-full"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm text-gray-200 truncate">
              {node.name}
            </span>
          )}

          {/* Action buttons on hover */}
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRename(node);
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(node);
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Render children if folder is open */}
        {node.type === "folder" && expandedFolders[node.path] && (
          <div>{renderTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-gray-700 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Explorer
        </span>
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Plus size={18} />
          </button>
          <AnimatePresence>
            {showNewMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-10"
              >
                <button
                  onClick={() => handleCreate("file")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-700"
                >
                  <FilePlus size={16} /> New File
                </button>
                <button
                  onClick={() => handleCreate("folder")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-700"
                >
                  <FolderPlus size={16} /> New Folder
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2">{renderTree(tree)}</div>
    </div>
  );
}