import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const mockProducts = [
  { id: 1, name: "Organic Apples", category: "Fruits", ecoScore: "A" },
  { id: 2, name: "Reusable Bottle", category: "Household", ecoScore: "B" },
  { id: 3, name: "LED Bulbs", category: "Electronics", ecoScore: "A" },
  { id: 4, name: "Plant-Based Milk", category: "Grocery", ecoScore: "A" },
  { id: 5, name: "Eco Detergent", category: "Household", ecoScore: "B" },
  { id: 6, name: "Bamboo Toothbrush", category: "Personal Care", ecoScore: "A" },
  { id: 7, name: "Organic T-Shirt", category: "Clothing", ecoScore: "B" },
  { id: 8, name: "Compost Bin", category: "Garden", ecoScore: "A" }
];

function AddToCart() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ecoCart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ecoCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-800">
        🌱 Walmart Eco Shop
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockProducts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.id * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">Category: {item.category}</p>
              <div className="flex items-center gap-2 mt-2">
                <Leaf className="w-4 h-4 text-green-500" />
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.ecoScore === "A"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  Eco Score: {item.ecoScore}
                </span>
              </div>
            </div>

            <Button
              className="mt-4 bg-green-600 text-white hover:bg-green-700"
              onClick={() => addToCart(item)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Cart Toggle Button (Bottom Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button
          className="rounded-full bg-green-600 text-white px-5 py-3 shadow-lg hover:bg-green-700 relative"
          onClick={() => setShowCart((prev) => !prev)}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl p-4 overflow-y-auto border-l border-gray-200 z-50"
        >
          <h3 className="text-xl font-bold mb-3 text-green-700">🛒 Cart</h3>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Cart is empty</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">{item.ecoScore}</span>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="mt-4 space-y-2">
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => window.location.href = "/score"}
              >
                ♻️ Analyze Cart
              </Button>

              {cart.length > 1 && (
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={clearCart}
                >
                  Clear All
                </Button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default AddToCart;
