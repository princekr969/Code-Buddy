import { useState } from "react";
import { useFileSystem } from "../../context/FileContext";

export default function RunPanel() {
  const { activeFile } = useFileSystem();
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    if (!activeFile) return;
    setLoading(true);
    setOutput("Running...");
    try {
      // Call your backend execution endpoint
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeFile.name.split(".").pop(),
          code: activeFile.content,
        }),
      });
      const data = await response.json();
      setOutput(data.output || data.error || "No output");
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-950 border-r-2 border-gray-700 text-white w-64 p-3 flex flex-col">
      <h3 className="font-semibold mb-3">Run Code</h3>
      <button
        onClick={runCode}
        disabled={!activeFile || loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm mb-3 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run"}
      </button>
      <div className="flex-1 bg-gray-800 p-2 rounded text-sm font-mono overflow-auto">
        {output || "Click Run to execute the current file."}
      </div>
    </div>
  );
}