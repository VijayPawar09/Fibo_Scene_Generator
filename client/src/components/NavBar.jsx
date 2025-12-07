import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  const active = (p) =>
    pathname === p ? "text-black" : "text-gray-500 hover:text-black";

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold">FiboAI</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className={active("/")}>Home</Link>
          <Link to="/generate" className={active("/generate")}>Generate</Link>
          <Link to="/history" className={active("/history")}>History</Link>
        </nav>
      </div>
    </header>
  );
}
