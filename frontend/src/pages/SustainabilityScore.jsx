import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function SustainabilityScore() {
  const [data, setData] = useState(null);
  const { width, height } = useWindowSize(); // For confetti

  useEffect(() => {
    // 1. Read cart from localStorage
    const stored = localStorage.getItem("ecoCart");
    const cartItems = stored ? JSON.parse(stored) : [];

    // 2. Make API call
    fetch("https://eco-cart-api.onrender.com/analyze-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cartItems.map((item) => item.name) }),
    })
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => {
        console.error("Error analyzing cart:", err);
        setData({ greenScore: 0 });
      });
  }, []);

  if (!data) return <p className="p-4 text-center">Analyzing your cart...</p>;

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🎉 Confetti */}
      {data.greenScore > 90 && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={250} />
      )}

      <h2 className="text-3xl font-bold text-center text-green-800">
        ♻️ Sustainability Score
      </h2>

      {/* Score Breakdown */}
      <motion.div
        className="bg-white p-5 sm:p-6 rounded-xl shadow-md space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h3 className="text-lg font-semibold mb-1">🌱 Green Score</h3>
          <Progress value={data.greenScore} />
          <p className="text-sm mt-1">{data.greenScore}/100</p>
        </div>

        <div>
          <h3 className="font-medium">
            🏭 CO₂ Impact: <span className="font-semibold">{data.co2Impact}g</span>
          </h3>
          <Progress value={Math.min(data.co2Impact / 5, 100)} />
        </div>

        <div>
          <h3 className="font-medium">
            💧 Water Usage: <span className="font-semibold">{data.waterUsage}L</span>
          </h3>
          <Progress value={Math.min(data.waterUsage * 2, 100)} />
        </div>

        <div>
          <h3 className="font-medium">
            📦 Packaging Waste: <span className="font-semibold">{data.packagingWaste}g</span>
          </h3>
          <Progress value={Math.min(data.packagingWaste / 2, 100)} />
        </div>
      </motion.div>

      {/* 🏅 Eco Badges */}
      <motion.div
        className="bg-green-50 p-5 rounded-xl shadow space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-center text-green-700">
          🏅 Your Eco Badges
        </h3>

        <div className="flex flex-wrap justify-center gap-3">
          {data.greenScore > 90 && (
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
              🌿 Green Hero
            </span>
          )}

          {data.isPlasticFree && (
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
              🚫 Plastic-Free Cart
            </span>
          )}

          {data.hasLocalItems && (
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
              🏡 Local Shopper
            </span>
          )}

          {data.greenScore <= 90 && (
            <div className="w-full mt-3">
              <p className="text-sm text-center mb-1 text-gray-700">
                Earn {91 - data.greenScore} more points to become a 🌿 Green Hero!
              </p>
              <Progress value={(data.greenScore / 91) * 100} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
        <Button
          className="bg-blue-600 text-white px-6 py-2"
          onClick={() => window.location.href = "/alternatives"}
        >
          View Greener Alternatives
        </Button>

        <Button
          className="bg-purple-600 text-white px-6 py-2"
          onClick={() => window.location.href = "/dashboard"}
        >
          📈 View Dashboard
        </Button>
      </div>
    </motion.div>
  );
}

export default SustainabilityScore;
