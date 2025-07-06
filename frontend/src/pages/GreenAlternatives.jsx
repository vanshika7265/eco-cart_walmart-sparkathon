import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function GreenAlternatives() {
  const [alternatives, setAlternatives] = useState([]);
  const [replaced, setReplaced] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // 🔁 Fetch recommendations from API
  useEffect(() => {
    const stored = localStorage.getItem("ecoCart");
    const cartItems = stored ? JSON.parse(stored) : [];

    fetch("https://eco-cart-api.onrender.com/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cart: cartItems.map((item) => item.name) })
    })
      .then((res) => res.json())
      .then((data) => setAlternatives(data.recommendations || []))
      .catch((err) => {
        console.error("Failed to fetch recommendations:", err);
      });
  }, []);

  const handleReplace = (item) => {
    setReplaced((prev) => {
      if (prev.includes(item.alternative)) {
        return prev.filter((alt) => alt !== item.alternative); // Undo
      } else {
        return [...prev, item.alternative]; // Replace
      }
    });
  };

  const impactData = alternatives
    .filter((item) => replaced.includes(item.alternative))
    .map((item) => ({
      name: item.type,
      reduction: item.value,
    }));

  const totalImpact = impactData.reduce((acc, cur) => acc + cur.reduction, 0);

  useEffect(() => {
    if (replaced.length === alternatives.length && alternatives.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [replaced, alternatives]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 relative">
      {showConfetti && <Confetti numberOfPieces={300} />}

      <h2 className="text-3xl font-bold text-center text-green-700">♻️ Green Alternatives</h2>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-center">🌍 Environmental Impact Reduction</h3>

        {impactData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Bar dataKey="reduction" fill="#4ade80" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center mt-3 text-green-700 font-medium">
              ✅ Total Impact Reduction: <strong>{totalImpact}%</strong>
            </p>
          </>
        ) : (
          <p className="text-center text-gray-500 py-20">No items replaced yet.</p>
        )}
      </div>

      {replaced.length === alternatives.length && alternatives.length > 0 && (
        <div className="text-center">
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block shadow">
            🏅 All Items Replaced – You’re a Green Champion!
          </span>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {alternatives.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center bg-white shadow p-4 rounded-xl"
          >
            <div>
              <p className="font-semibold">🧺 {item.original}</p>
              <p className="text-sm text-gray-500">Replaced with:</p>
              <p className="text-green-600 font-semibold">♻️ {item.alternative}</p>
            </div>

            <div className="text-sm text-blue-600 font-medium">
              {item.impact}
            </div>

            <Button
              className={`text-white ${replaced.includes(item.alternative) ? "bg-gray-500" : "bg-green-500"}`}
              onClick={() => handleReplace(item)}
            >
              {replaced.includes(item.alternative) ? "Undo" : "Replace"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default GreenAlternatives;
