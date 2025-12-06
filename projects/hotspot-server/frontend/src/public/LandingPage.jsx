import { useState } from "react";
import PackageCard from "./PackageCard";
import { useMpesa } from "../hooks/useMpesa";
import "./../styles/global.css";

export default function LandingPage() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { initiateStk } = useMpesa();

  const packages = [
    { id: 1, name: "30 Minutes", price: 10 },
    { id: 2, name: "1 Hour", price: 20 },
    { id: 3, name: "24 Hours", price: 50 },
  ];

  const handlePay = () => {
    if (!selectedPackage) return alert("Choose a package first.");
    initiateStk(selectedPackage.price);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Hotspot</h1>
      <h2 className="text-lg mb-6">Choose your package</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedPackage?.id === pkg.id}
            onSelect={() => setSelectedPackage(pkg)}
          />
        ))}
      </div>

      <button
        onClick={handlePay}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Pay with M-Pesa
      </button>
    </div>
  );
}
