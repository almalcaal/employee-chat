import { Routes, Route, Navigate } from "react-router";
import Navbar from "./components/common/Navbar.component.jsx";
import HomeScreen from "./screens/common/Home.screen.jsx";
import SignUpScreen from "./screens/common/SignUp.screen.jsx";
import LoginScreen from "./screens/common/Login.screen.jsx";
import SettingsScreen from "./screens/common/Settings.screen.jsx";
import ProfileScreen from "./screens/common/Profile.screen.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size=10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomeScreen /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpScreen /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginScreen /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route
          path="/profile"
          element={authUser ? <ProfileScreen /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
