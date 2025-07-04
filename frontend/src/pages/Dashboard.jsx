import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

import { motion } from "framer-motion";

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const co2Data = [
  { name: "Apples", value: 100 },
  { name: "Bottle", value: 300 },
  { name: "Detergent", value: 200 },
  { name: "T-shirt", value: 150 },
];

const waterData = [
  { name: "Apples", water: 10 },
  { name: "Bottle", water: 40 },
  { name: "Detergent", water: 30 },
  { name: "T-shirt", water: 20 },
];

const scoreTrend = [
  { day: 'Mon', score: 60 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 78 },
  { day: 'Fri', score: 82 },
];

function Dashboard() {
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

      {/* Pie Chart Card */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-2">
        <h3 className="text-lg font-semibold text-center text-gray-800">CO₂ Contribution</h3>
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

      {/* Bar Chart Card */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-2">
        <h3 className="text-lg font-semibold text-center text-gray-800">💧 Water Usage per Item</h3>
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

      {/* Line Chart Card */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-2">
        <h3 className="text-lg font-semibold text-center text-gray-800">📈 Green Score Over Time</h3>
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
