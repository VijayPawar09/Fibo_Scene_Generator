import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          FiboAI – AI Image Generator
        </h1>
        <p className="mt-4 text-gray-600">
          Enter a prompt and generate images with OpenAI gpt-image-1. History is
          stored locally in your session.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/generate"
            className="px-5 py-2.5 rounded-lg bg-black text-white hover:opacity-90"
          >
            Generate Image
          </Link>
          <Link
            to="/history"
            className="px-5 py-2.5 rounded-lg border hover:bg-gray-50"
          >
            View History
          </Link>
        </div>
      </div>
    </section>
  );
}
