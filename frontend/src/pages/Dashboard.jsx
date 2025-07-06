import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("https://eco-cart-api.onrender.com/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to load dashboard stats:", err);
      });
  }, []);

  if (!stats) return <p className="p-4 text-center">Loading dashboard data...</p>;

  const co2Data = stats.top_categories_by_impact.map((item) => ({
    name: item.category,
    value: item.carbon,
  }));

  const waterData = [
    { name: "Avg Water", water: stats.average_water },
    { name: "Avg Packaging", water: stats.average_packaging },
  ];

  const scoreTrend = [
    { day: 'Mon', score: stats.average_carbon - 20 },
    { day: 'Tue', score: stats.average_carbon - 10 },
    { day: 'Wed', score: stats.average_carbon },
    { day: 'Thu', score: stats.average_carbon + 5 },
    { day: 'Fri', score: stats.average_carbon + 10 },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 py-6 md:px-8 md:py-10 space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold text-center text-green-800">
        📊 Sustainability Dashboard
      </h2>

      {/* Pie Chart: CO2 by category */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-2">
        <h3 className="text-lg font-semibold text-center text-gray-800">CO₂ Contribution by Category</h3>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={co2Data}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {co2Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Avg Water + Packaging */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-2">
        <h3 className="text-lg font-semibold text-center text-gray-800">💧 Water & Packaging Usage (Average)</h3>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart data={waterData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="water" fill="#34D399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Green Score Over Days */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-2">
        <h3 className="text-lg font-semibold text-center text-gray-800">📈 Average Green Score Trend</h3>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={scoreTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
