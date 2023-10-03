import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../firebase'; // Import the Firebase signOut function
//import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import the Firebase auth instance

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Use Firebase's signOut method to log out the user
      await auth.signOut(); // Make sure you import signOut from your Firebase setup

      // Redirect the user to the login page (or any other desired page)
      navigate('/farmerlogin');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout errors, display an error message, etc.
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
