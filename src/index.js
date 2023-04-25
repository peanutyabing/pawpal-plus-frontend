import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.js";
import MyPets from "./Components/MyPets.js";
import Navigation from "./Components/Navigation.js";
import Events from "./Components/Events.js";
import PetForm from "./Components/PetForm.js";
import Posts from "./Components/Posts";
import IndividualPost from "./Components/IndividualPost";
import Chat from "./Components/Chat";
import socketIO from "socket.io-client";
import Home from "./Components/Home";

const socket = socketIO.connect("http://localhost:8000");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    {/* <Navigation /> */}
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/my-pets" element={<MyPets />} />
      <Route path="/my-pets/add-pet" element={<PetForm />} />
      <Route path="/my-pets/:petId" element={<Events />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:postId" element={<IndividualPost />} />
      <Route path="/chat" element={<Chat socket={socket} />} />
      <Route path="/home" element={<Home socket={socket} />} />
    </Routes>
  </BrowserRouter>
);
