import "./App.css";
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase-setup/firebase";
import { Route, Routes } from "react-router-dom";
import { useStateValue } from './StateProvider';

// page imports
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Tasks from "./Tasks";
import PathError from "./PathError";

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    //will only run once when the app component loads...

    auth.onAuthStateChanged(authUser => {
      console.log('THE USER IS >>>>', authUser);

      if (authUser) {
        // the user just logged in / the user was logged in
        
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        // the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])

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
