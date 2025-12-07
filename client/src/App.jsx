import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import HistoryPage from "./pages/History";

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
  const [history, setHistory] = useState([]); // in-memory only
  function addHistory(item) {
    setHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        prompt: item.prompt,
        imageUrl: item.imageUrl,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/generate"
            element={<Generate apiBase={API_BASE} onAddHistory={addHistory} />}
          />
          <Route
            path="/history"
            element={<HistoryPage items={history} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
