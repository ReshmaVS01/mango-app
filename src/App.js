//import logo from './logo.svg';
import './App.css';
import { Route, Routes, Router, Switch, Link } from 'react-router-dom'
//import Colors from './constants/Colors.js';
import React from 'react';
import Layout from './components/Layout/layout.js'
import Welcome from './components/Welcome/welcome';
import FarmerRegister from './components/Farmer-login/farmer-register';
import FarmerLogin from './components/Farmer-login/farmer-login';
import FarmerLogout from './components/Farmer-login/farmer-logout';
import FarmerDashboard from './components/Farmer-dashboard/farmer-dashboard';
import PackhouseRegister from './components/Packhouse-login/packhouse-register';
import PackhouseLogin from './components/Packhouse-login/packhouse-login';
//import PackhouseRegister from './components/Packhouse-login/packhouse-register';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}></Route>
        <Route path="/welcome" element={<Welcome />}></Route>
        <Route path="/farmerregister" element={<FarmerRegister />}></Route>
        <Route path="/farmerlogin" element={<FarmerLogin />}></Route>
        <Route path="/farmerdashboard" element={<FarmerDashboard />}></Route>
        <Route path="/farmerlogout" element={<FarmerLogout />}></Route>
        <Route path="/packhouseregister" element={<PackhouseRegister />}></Route>
        <Route path="/packhouselogin" element={<PackhouseLogin />}></Route>



    </Routes>
    </>
  );
}

export default App;


