import { Files, MessageSquare, Users, Play } from "lucide-react";

const tabs = [
  { id: "files", icon: Files, label: "Files" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "users", icon: Users, label: "Users" },
  { id: "run", icon: Play, label: "Run Code" },
];

export default function ActivityBar({ activeTab, setActiveTab }) {
  return (
    <div className="w-16 bg-slate-950 border-r-2 border-gray-800 flex flex-col items-center py-4">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`p-3 rounded-lg mb-2 transition-colors ${
            activeTab === id
              ? "text-white bg-gray-800"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          }`}
          title={label}
        >
          <Icon size={24} />
        </button>
      ))}
    </div>
  );
}