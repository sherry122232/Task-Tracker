import React, { useState } from "react";
import { auth, db } from './firebase-setup/firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './App.css';

function Register() {

  //to move to tasks after registration
  const history = useNavigate();
  //have to collect email
  const [email, setEmail] = useState('');
  //have to collect password
  const [password, setPassword] = useState('');
  //Let's ask for name as well
  const [name, setName] = useState('');
  //for hiding password purposes
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
  };

  //register button
  const register = e => {
    e.preventDefault();

    auth 
        .createUserWithEmailAndPassword(email, password)
        .then((auth) => {
            if (auth) {
                history('/tasks');
            }
        })
        .catch(error => alert(error.message))

    auth.onAuthStateChanged(user => {
        db
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .doc("DummyTask")
        .set({
          name: "Dummy",
          due: "01/01/2024",
          text: "This is dummy task",
          status: "Not started"
        })

        db
        .collection('user_names')
        .doc(user.uid)
        .set({
          name: name
        })
    })

    alert("You have registered")
  }
  return (
    <div className="register-container">
      <h2 className="register-title">Register for Task Tracker</h2>
      <form onSubmit={register} className="register-form">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type={passwordShown ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="button" className="password-toggle"  onClick={togglePasswordVisiblity}>
          {passwordShown ? 'Hide' : 'Show'}
        </button>
        <button type="submit" className="register-button" style={{marginBottom: "4%"}}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;