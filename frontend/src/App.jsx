import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddToCart from "./pages/AddToCart";
import SustainabilityScore from "./pages/SustainabilityScore";
import GreenAlternatives from "./pages/GreenAlternatives";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddToCart />} />
        <Route path="/score" element={<SustainabilityScore />} />
        <Route path="/alternatives" element={<GreenAlternatives />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
