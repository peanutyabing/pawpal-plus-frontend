import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./Context/AuthProvider.js";
import RequireAuth from "./Components/RequireAuth.js";
import App from "./App.js";
import MyPets from "./Components/MyPets.js";
import Navigation from "./Components/Navigation.js";
import Events from "./Components/Events.js";
import PetForm from "./Components/PetForm.js";
import EventForm from "./Components/EventForm.js";
import SignIn from "./Components/SignIn.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Navigation />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/sign-in" element={<SignIn />} />
        {/* New user sign up page goes here */}

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/my-pets" element={<MyPets />} />
          <Route path="/my-pets/add-pet" element={<PetForm />} />
          <Route path="/my-pets/:petId" element={<Events />} />
          <Route path="/my-pets/:petId/add-activity" element={<EventForm />} />
        </Route>
        {/* Catch-all */}
        {/* <Route path="*" element={}/> */}
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
