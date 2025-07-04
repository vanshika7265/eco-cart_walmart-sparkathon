import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const alternatives = [
  { original: "Plastic Bottle", alternative: "Reusable Bottle", impact: "-90% Waste", type: "Waste", value: 90 },
  { original: "Regular Detergent", alternative: "Eco Detergent", impact: "-70% Carbon", type: "Carbon", value: 70 },
  { original: "Normal Toothbrush", alternative: "Bamboo Toothbrush", impact: "-65% Plastic", type: "Plastic", value: 65 },
];

function GreenAlternatives() {
  const [replaced, setReplaced] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleReplace = (item) => {
    setReplaced((prev) => {
      if (prev.includes(item.alternative)) {
        return prev.filter((alt) => alt !== item.alternative); // Undo
      } else {
        return [...prev, item.alternative]; // Replace
      }
    });
  };

  // Calculate active replacements
  const impactData = alternatives
    .filter((item) => replaced.includes(item.alternative))
    .map((item) => ({
      name: item.type,
      reduction: item.value
    }));

  // Total impact calculation
  const totalImpact = impactData.reduce((acc, cur) => acc + cur.reduction, 0);

  // Trigger confetti when all items are replaced
  useEffect(() => {
    if (replaced.length === alternatives.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // auto stop after 4s
    }
  }, [replaced]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 relative">
      {showConfetti && <Confetti numberOfPieces={300} />}

      <h2 className="text-3xl font-bold text-center text-green-700">♻️ Green Alternatives</h2>

      {/* Summary Impact Chart */}
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

      {/* Badge for full replacement */}
      {replaced.length === alternatives.length && (
        <div className="text-center">
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block shadow">
            🏅 All Items Replaced – You’re a Green Champion!
          </span>
        </div>
      )}

      {/* Alternatives List */}
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
