// File: src/App.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import manualDb from "./data/manualDb.json";

export default function App() {
  const [offers, setOffers] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetch("https://your-hostinger-api.com/offers")
      .then((res) => res.json())
      .then((data) => {
        setOffers(data);
        const counts = manualDb.map((m) => ({
          name: m.name,
          count: data.filter((d) => d.pubid === m.pubid).length,
        }));
        setSummary(counts);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Offers</h2>
        <ul className="space-y-2">
          {offers.map((offer, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-blue-100"
            >
              {offer.title || offer.pubid}
            </motion.li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Matched Summary</h1>
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Match Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
