import React, { useState } from "react";
import { auth, db } from './firebase-setup/firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Register() {

  //to move to tasks after registration
  const history = useNavigate();
  //have to collect email
  const [email, setEmail] = useState('');
  //have to collect password
  const [password, setPassword] = useState('');
  //Let's ask for name as well
  const [name, setName] = useState('');


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
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit" className="register-button">
          Register
        </button>
        Already Have an Account?
        <Link to='/login'>
          <button type="submit" className="login-button">Login</button>
        </Link>
      </form>
    </div>
  );
};

export default Register;