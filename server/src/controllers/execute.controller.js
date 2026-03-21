const CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;
console.log("JDoodle credentials loaded:", {
  clientId: !!CLIENT_ID,
  clientSecret: !!CLIENT_SECRET,
});

const LANG_MAP = {
  python:     { language: "python3",      versionIndex: "3" },
  javascript: { language: "nodejs",       versionIndex: "4" },
  typescript: { language: "typescript",   versionIndex: "0" },
  java:       { language: "java",         versionIndex: "4" },
  "c++":      { language: "cpp17",        versionIndex: "1" },
  c:          { language: "c",            versionIndex: "5" },
  csharp:     { language: "csharp",       versionIndex: "3" },
  go:         { language: "go",           versionIndex: "4" },
  rust:       { language: "rust",         versionIndex: "4" },
  ruby:       { language: "ruby",         versionIndex: "4" },
  php:        { language: "php",          versionIndex: "4" },
  swift:      { language: "swift",        versionIndex: "4" },
  kotlin:     { language: "kotlinc",      versionIndex: "3" },
  bash:       { language: "bash",         versionIndex: "4" },
  lua:        { language: "lua",          versionIndex: "2" },
  haskell:    { language: "haskell",      versionIndex: "3" },
  scala:      { language: "scala",        versionIndex: "4" },
  perl:       { language: "perl",         versionIndex: "4" },
  r:          { language: "r",            versionIndex: "4" },
  rscript:    { language: "r",            versionIndex: "4" },
  dart:       { language: "dart",         versionIndex: "4" },
  elixir:     { language: "elixir",       versionIndex: "3" },
  groovy:     { language: "groovy",       versionIndex: "3" },
  julia:      { language: "julia",        versionIndex: "2" },
  pascal:     { language: "pascal",       versionIndex: "3" },
  sqlite3:    { language: "sql",          versionIndex: "0" },
};

export async function main(code, language, stdin) {
  if (!language) throw new Error("Language is required");
  if (!code) throw new Error("Code is required");
  if (!CLIENT_ID || !CLIENT_SECRET) throw new Error("JDoodle credentials missing");

  const langConfig = LANG_MAP[language];
  if (!langConfig) {
    return { type: "stderr", output: `Language "${language}" is not supported` };
  }

  console.log("Calling JDoodle:", langConfig.language, "v", langConfig.versionIndex);

  const response = await fetch("https://api.jdoodle.com/v1/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      script: code,
      language: langConfig.language,
      versionIndex: langConfig.versionIndex,
      stdin: stdin || "",
    }),
  });

  const text = await response.text();
  console.log("JDoodle status:", response.status);
  console.log("JDoodle response:", text);

  if (!text) throw new Error("Empty response from JDoodle");

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON: ${text}`);
  }

  // JDoodle error
  if (result.error) {
    return { type: "stderr", output: result.error };
  }

  // Check for runtime errors in output
  if (result.statusCode !== 200 && result.statusCode !== undefined) {
    return { type: "stderr", output: result.output || "Execution failed" };
  }

  return { type: "stdout", output: result.output || "(no output)" };
}

export async function getLanguages() {
  return Object.entries(LANG_MAP).map(([key], index) => ({
    id: index + 1,
    name: key,
    language: key,
    version: "latest",
  }));
}   

const executeCode = async (req, res) => {
  const { code, language, stdin } = req.body; 

  console.log("Execute request:", { language, codeLength: code?.length });

  if (!code) return res.status(400).json({ error: "Code is required" });
  if (!language) return res.status(400).json({ error: "Language is required" });

  try {
    const { type, output } = await main(code, language, null, stdin);
    if (type === "stdout") {
      res.status(200).json({ success: true, output });
    } else {
      res.status(200).json({ success: false, error: output });
    }
  } catch (error) {
    console.error("Execution error:", error.message);
    res.status(500).json({ error: "Execution failed", details: error.message });
  }
};

const getSupportedLanguages = async (req, res) => {
  try {
    const languages = await getLanguages();
    const displayNames = {
      python: "Python 3", javascript: "JavaScript (Node.js)",
      typescript: "TypeScript", java: "Java", "c++": "C++ (cpp17)",
      c: "C", csharp: "C#", go: "Go", rust: "Rust",
      ruby: "Ruby", php: "PHP", swift: "Swift", kotlin: "Kotlin",
      bash: "Bash", lua: "Lua", haskell: "Haskell", scala: "Scala",
      perl: "Perl", rscript: "R", dart: "Dart", elixir: "Elixir",
      groovy: "Groovy", julia: "Julia", pascal: "Pascal", sqlite3: "SQLite3",
    };

    res.status(200).json({
      result: languages.map((l) => ({
        ...l,
        name: displayNames[l.language] || l.language, 
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch languages" });
  }
};


export { executeCode, getSupportedLanguages };
