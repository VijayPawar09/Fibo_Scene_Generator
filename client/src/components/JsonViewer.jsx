export default function JsonViewer({ data }) {
  return (
    <pre className="p-4 bg-black text-green-400 rounded-xl shadow text-sm overflow-auto max-h-80">
      {data ? JSON.stringify(data, null, 2) : "JSON will appear here..."}
    </pre>
  );
}
