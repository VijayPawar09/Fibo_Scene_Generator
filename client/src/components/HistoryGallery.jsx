export default function HistoryGallery({ items = [], onRerun }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-purple-300 text-lg">No generations yet</p>
        <p className="text-purple-400 text-sm mt-2">
          Create your first scene to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items
          ?.slice()
          .reverse()
          .map((it) => (
            <button
              key={it.id}
              className="group relative text-left focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl transition duration-300"
              onClick={() => onRerun?.(it)}
              title={it.prompt}
            >
              {/* Card Container */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-400 transition duration-300 transform hover:scale-105 hover:shadow-2xl">
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  {it.imageUrl ? (
                    <>
                      <img
                        src={it.imageUrl}
                        alt={it.prompt || `scene-${it.id}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-4">
                  <p className="text-white font-medium line-clamp-2 group-hover:text-purple-300 transition">
                    {it.prompt || "(no prompt)"}
                  </p>
                  <p className="text-purple-300 text-xs mt-2 opacity-0 group-hover:opacity-100 transition">
                    {it.timestamp
                      ? new Date(it.timestamp).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
