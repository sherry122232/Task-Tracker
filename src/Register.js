import React, { useState } from "react";
import { auth, db } from './firebase-setup/firebase';
import { useNavigate } from 'react-router-dom';

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

  return <div>Register for Task Tracker</div>;
}

export default Register;
