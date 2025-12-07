import HistoryGallery from "../components/HistoryGallery";

export default function HistoryPage({ items = [] }) {
  return (
    <section className="space-y-6">
      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">History</h2>
        <HistoryGallery items={items} />
      </div>
    </section>
  );
}
