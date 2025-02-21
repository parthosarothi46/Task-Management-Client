import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await axios.post(`${import.meta.VITE_API_URL}/api/users`, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        } catch (error) {
          console.error("Error storing user data:", error);
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
        darkMode ? "dark" : ""
      }`}
    >
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

        <Route
          path="/"
          element={
            user ? (
              <Dashboard
                user={user}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
