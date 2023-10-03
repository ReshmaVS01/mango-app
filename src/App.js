//import logo from './logo.svg';
import './App.css';
import { Route, Routes, Router, Switch, Link } from 'react-router-dom'
//import Colors from './constants/Colors.js';
import React from 'react';
import Layout from './components/Layout/layout.js'
import Welcome from './components/Welcome/welcome';
import FarmerLogin from './components/Farmer-login/farmer-login';
import FarmerLog from './components/Farmer-login/farmer-log';
import FarmerLogout from './components/Farmer-login/farmer-logout';
import FarmerDashboard from './components/Farmer-dashboard/farmer-dashboard';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}></Route>
        <Route path="/welcome" element={<Welcome />}></Route>
        <Route path="/farmerlogin" element={<FarmerLogin />}></Route>
        <Route path="/farmerlog" element={<FarmerLog />}></Route>
        <Route path="/farmerdashboard" element={<FarmerDashboard />}></Route>
        <Route path="/farmerlogout" element={<FarmerLogout />}></Route>


    </Routes>
    </>
  );
}

export default App;


