export default function PackageCard({ pkg, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-lg shadow-md border 
        ${selected ? "border-green-600 bg-green-50" : "border-gray-300"}`}
    >
      <h3 className="text-xl font-semibold">{pkg.name}</h3>
      <p className="text-gray-600 mt-2">KSH {pkg.price}</p>
    </div>
  );
}
