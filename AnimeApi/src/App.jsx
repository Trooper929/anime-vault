import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Vault from "./pages/Vault.jsx";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Details from "./pages/Details";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/anime/:id" element={<Details />} />
        <Route path="/vault" element={<Vault />} />
      </Routes>
    </>
  );
}

export default App;
