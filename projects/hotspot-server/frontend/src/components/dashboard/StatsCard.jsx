export default function StatsCard({ label, value }) {
  return (
    <div className="p-6 bg-white shadow rounded border">
      <p className="text-gray-600">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

