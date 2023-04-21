import React, { useState } from "react";
import { auth } from "./firebase-setup/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  //to move the person to main page
  const history = useNavigate();
  //email
  const [email, setEmail] = useState("");
  //password
  const [password, setPassword] = useState("");

  //for hiding password purposes
  const [passwordShown, setPasswordShown] = useState(false);

  //to hide password
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  //authontication process
  const logIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        if (auth) {
          history("/tasks");
        }
      })
      .catch((error) => alert(error.message));

    alert("Signed in!");
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={logIn} className="login-form">
        <label htmlFor="email" className="login-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password" className="login-label">
          Password:
        </label>
        <input
          type={passwordShown ? "text" : "password"}
          id="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisiblity}
        >
          {passwordShown ? "Hide" : "Show"}
        </button>
        <br />
        <button
          type="submit"
          className="login-button"
          style={{ marginBottom: "4%" }}
        >
          Login
        </button>
        <div className="password-toggle">
          Don't have an account?{" "}
          <Link to="/register">
            <button type="button">Register</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
