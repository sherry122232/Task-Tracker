import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <center className="home-container">
      <h2 className="home-title">Welcome to Task Tracker!</h2>
      <h2 className="login-title">Helping you get things accomplished!</h2>
      <div>
        <Link to="/login">
          <button type="submit" className="login-button" style={{marginTop: "10%", marginBottom: "6%"}}>Login</button>
        </Link>
        <Link to="/register">
          <button type="submit" className="login-button">Register</button>
        </Link>
      </div>
    </center>
  );
}

export default Home;
