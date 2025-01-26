import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contribution from "./pages/auth/Contribution";
import Profile from "./pages/auth/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Explore from "./pages/auth/Explore";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contribution"
          element={
            <ProtectedRoute>
              <Contribution />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
