import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import manualDb from '../data/manualDb.json';

const Dashboard = ({ onLogout }) => {
  const [offers, setOffers] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch data from server');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 border-r flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800">Offer Dashboard</h1>
          <p className="text-sm text-gray-600">Analytics Panel</p>
        </div>
        
        <h2 className="text-lg font-semibold mb-4">Offers</h2>
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {offers.map((offer, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-blue-100 border border-gray-200"
            >
              <div className="font-medium">{offer.title || 'No Title'}</div>
              <div className="text-sm text-gray-500">{offer.pubid}</div>
            </motion.li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Matched Summary
          </h1>
          <p className="text-gray-600">
            Count of matching pubids between manual data and Hostinger offers
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Match Count
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b hover:bg-gray-50 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.count > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.count} matches
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.count > 0 ? 'Active' : 'No matches'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Names</h3>
            <p className="text-2xl font-bold text-gray-800">{summary.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Matches</h3>
            <p className="text-2xl font-bold text-green-600">
              {summary.reduce((acc, item) => acc + item.count, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Active Names</h3>
            <p className="text-2xl font-bold text-blue-600">
              {summary.filter(item => item.count > 0).length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;