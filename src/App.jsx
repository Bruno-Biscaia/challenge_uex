import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import Home from "./pages/private/Home";
import NotFound from "./pages/public/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./Contexts/AuthContext";
import { Container } from "@mui/material";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container maxWidth="full" className="appContainer">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
