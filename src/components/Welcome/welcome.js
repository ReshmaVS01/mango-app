import {Link, NavLink } from 'react-router-dom'
import './welcome.css';
import Farmer from '../Farmer-login/farmer-login';

const Welcome = () => {
    return (
    <>
    <Link to="/FarmerRegister">Farmer</Link>
    <Link to="/PackhouseRegister">Packhouse</Link>
    
    </>
    ); 
}


export default Welcome