import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { motion } from "framer-motion";

function EcoAlternatives() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAlternatives() {
      try {
        const res = await api.post("/recommendations", {
          cart: ["toothbrush", "shampoo"],
        });
        setRecommendations(res.data);
      } catch (err) {
        setError("⚠️ Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    }

    fetchAlternatives();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-800">
        ♻️ Eco-Friendly Recommendations
      </h2>

      {loading && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          Fetching greener options...
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-5">
          {recommendations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white shadow-md hover:shadow-lg p-5 rounded-2xl transition-all duration-300"
            >
              <div>
                <p className="font-semibold text-gray-800">🧺 {item.original}</p>
                <p className="text-sm text-gray-500">Replaced with:</p>
                <p className="text-green-600 font-semibold">♻️ {item.alternative}</p>
              </div>

              <div className="text-sm text-blue-600 font-medium whitespace-nowrap">
                {item.impact}
              </div>

              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Replace
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EcoAlternatives;
