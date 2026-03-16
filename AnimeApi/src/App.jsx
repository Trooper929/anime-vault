import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import SplashScreen from "./components/SplashScreen";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Details from "./pages/Details";
import Vault from "./pages/Vault";
import Stats from "./pages/Stats";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem("splashSeen");
    if (seen) return false;
    sessionStorage.setItem("splashSeen", "1");
    return true;
  });

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/anime/:id" element={<Details />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/stats" element={<Stats />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
