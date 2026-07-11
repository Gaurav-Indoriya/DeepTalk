import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {

    return (

        <Routes>

            {/* Landing Page */}
            <Route
                path="/"
                element={<Home />}
            />

            {/* Login */}
            <Route
                path="/Login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* Register */}
            <Route
                path="/Register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Chat */}
            <Route
                path="/Home"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />

            {/* Invalid URL */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>

    );

}

export default App;