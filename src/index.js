import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import MyPet from "./Components/MyPet.js";
import Navigation from "./Components/Navigation.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Navigation />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/my-pet" element={<MyPet />} />
    </Routes>
  </BrowserRouter>
);
