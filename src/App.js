import "./App.css";
import React, { useState, useEffect } from "react";
import { db } from "./firebase-setup/firebase";
import { Route, Routes } from "react-router-dom";

// page imports
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Tasks from "./Tasks";
import PathError from "./PathError";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="*" element={<PathError />} />
    </Routes>
  );
}

export default App;
