export default function HistoryGallery({ items = [], onRerun }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow w-full">
      <div className="text-sm font-semibold mb-3">History</div>
      {(!items || items.length === 0) && (
        <div className="text-xs text-gray-500">No history yet</div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {items?.slice().reverse().map((it) => (
          <button
            key={it.id}
            className="group w-full text-left"
            onClick={() => onRerun?.(it)}
            title={it.prompt}
          >
            <div className="aspect-square w-full overflow-hidden rounded border">
              {it.imageUrl ? (
                <img
                  src={it.imageUrl}
                  alt={it.prompt || `scene-${it.id}`}
                  className="w-full h-full object-cover group-hover:opacity-90"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="mt-1 text-[10px] text-gray-600 line-clamp-2">
              {it.prompt || "(no prompt)"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
