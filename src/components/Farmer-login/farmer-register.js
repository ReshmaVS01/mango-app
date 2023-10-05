import './farmer-register.css'
import {Link, NavLink } from 'react-router-dom'
import {useRef, useState} from "react";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
 // Adjust the import path as needed
import { auth, db } from '../../firebase.js';


const FarmerLogin = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        farmName: "",
        nationality: "",
      });
    
      
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match.");
          return;
        }
    
        try {
            // Create user account with email and password
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
            // Save additional user data to Firestore
            await addDoc(collection(db, "users"), {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              farmName: formData.farmName,
              nationality: formData.nationality,
            });
    
          console.log("User account created and data saved successfully!");
        } catch (error) {
          console.error("Error creating user account and saving data:", error);
        }
      };
    return (<>
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
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
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="farmName">Farm Name:</label>
          <input
            type="text"
            id="farmName"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="nationality">Nationality:</label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
      <div>Already a user?<Link to="/FarmerLogin">Log In</Link></div>
    </div>
    </>
    );
}

export default FarmerLogin