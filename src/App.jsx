import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import Home from "./pages/private/Home";
import NotFound from "./pages/public/NotFound";
import PrivateRoute from "./components/PrivateRoute"; // Componente para proteger rotas privadas
import { AuthProvider } from './Contexts/AuthContext'; 

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{"margin":"30px"}}>
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
