import React from 'react'
import './Navbar.css';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function Left(props) {
    const user = useSelector(state => state.user)

    if (user.userData && user.userData.role===1){
        return (
             <div className="left">
                <ul style={{fontSize:"12pt", listStyle:"none"}}>
                    <li><a className="nav-title" href="/admin" style={{color:"black"}}>Admin</a></li>
                    <li><a className="nav-title" href="/product"  style={{color:"black"}}>Product</a></li>
                </ul>
            </div>
        )
    
      }else {
       
        return (
            <div className="left">
                <ul style={{fontSize:"12pt", listStyle:"none"}}>
                    <li><a className="nav-title" href="/" style={{color:"black"}}>Home</a></li>
                    <li><a className="nav-title" href="/product"  style={{color:"black"}}>Product</a></li>
                </ul>
                
            </div>
        )
          
      }

}

export default withRouter(Left);
