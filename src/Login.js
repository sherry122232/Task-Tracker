import React, { useState } from 'react'
import { auth } from './firebase-setup/firebase';
import { useNavigate } from 'react-router-dom';

function Login() {

  //to move the person to main page
  const history = useNavigate();
  //email
  const [email, setEmail] = useState('');
  //password
  const [password, setPassword] = useState('');

  //for hiding password purposes
  const [passwordShown, setPasswordShown] = useState(false);
    
  //to hide password
  const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
  };

  //authontication process
  const logIn = e => {
    e.preventDefault();
  
    auth   
        .signInWithEmailAndPassword(email, password)
        .then(auth => {
            history('/tasks');
        })
        .catch(error => alert(error.message))
  }

  return <div>Login Page</div>;
}

export default Login;
