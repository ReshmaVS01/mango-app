// Login.js
import './farmer-login.css';
import'./farmer-register.js';
import { useNavigate } from 'react-router-dom'; // Import Redirect
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, } from 'firebase/auth';
import React, { useState, setUserLoggedIn } from 'react';
import { auth } from '../../firebase'; // Import the Firebase auth instance

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use Firebase's signInWithEmailAndPassword method to log in the user
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Logged In")
      // After a successful login, you can redirect to another page or update the UI
      // Example: Redirect to a dashboard page
      navigate('/farmerdashboard');
      
      // You can also set a state variable to indicate that the user is logged in
      //setUserLoggedIn(true);
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login errors, display an error message, etc.
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
