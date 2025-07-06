import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

function EcoAlternatives() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replaced, setReplaced] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("ecoCart");
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    // 🔁 Redirect if cart is empty
    if (parsedCart.length === 0) {
      router.push("/");
      return;
    }

    const productNames = parsedCart.map((item) => item.name.toLowerCase());

    async function fetchAlternatives() {
      try {
        const res = await api.post("/recommendations", {
          cart: productNames,
        });
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    }

    fetchAlternatives();

    // 🧠 Load replaced state from localStorage
    const storedReplaced = localStorage.getItem("replacedItems");
    if (storedReplaced) {
      setReplaced(JSON.parse(storedReplaced));
    }
  }, [router]);

  // ✅ Mark item as replaced
  const handleReplace = (item) => {
    const updated = [...replaced, item.alternative];
    setReplaced(updated);
    localStorage.setItem("replacedItems", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
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

      {!loading && !error && recommendations.length > 0 && (
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

              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={replaced.includes(item.alternative)}
                onClick={() => handleReplace(item)}
              >
                {replaced.includes(item.alternative) ? "✅ Replaced" : "Replace"}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <p className="text-center text-gray-500">No alternatives found for your cart.</p>
      )}

      {/* 🧭 Back to Cart Button */}
      <div className="pt-8 flex justify-center">
        <Button
          className="bg-blue-600 text-white px-6 py-2"
          onClick={() => router.push("/")}
        >
          ← Back to Cart
        </Button>
      </div>
    </div>
  );
}

export default EcoAlternatives;
