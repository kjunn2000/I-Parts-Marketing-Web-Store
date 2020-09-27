import React from 'react'
import { Icon , Badge} from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import './Navbar.css';


function Right(props) {
    const user = useSelector(state => state.user)

    const logoutHandler = () => {
        axios.get(`${USER_SERVER}/logout`).then(response => {
        if (response.status === 200) {
            props.history.push("/login");
        } else {
            alert('Log Out Failed')
        }
        });
    };

    if (user.userData && !user.userData.isAuth) {
        return (
            <div className="right" style={{paddingTop:"10px",fontSize:"12pt"}}>
                <ul style={{listStyle:"none"}}>
                    <li><a className="nav-title" href="/register"  style={{color:"black"}}>Become A Member</a></li>
                    <li className="logInOutButton"><a href="/login"  style={{color:"black"}}>Log In</a></li>
                </ul>
            </div>
        )
      } else if (user.userData && user.userData.role==1){
        return (
            <div className="right" style={{paddingTop:"10px",fontSize:"12pt"}}>
                <ul style={{listStyle:"none"}}>
                    <li><a className="nav-title" href="/product/upload" style={{color:"black"}}>Upload</a></li>
                    <li className="logInOutButton"><a onClick={logoutHandler} style={{color:"black"}}>Logout</a></li>
                </ul>
            </div>
        )
    
      }else {
       
        return (
            <div className="right" style={{paddingTop:"10px",fontSize:"12pt"}}>
                <ul style={{gridTemplateColumns:"1fr 1fr 1fr" ,listStyle:"none"}}>
                    <li><a className="nav-title" href="/history" style={{color:"black"}}>History</a></li>
                    <li>
                        <Badge count={user.userData && user.userData.cart.length}>
                            <a href="/user/cart" style={{ color: '#66777'}}>
                                <Icon type="shopping-cart" style={{fontSize: 30 ,color:"black"}}/>
                            </a>
                        </Badge>
                    </li>
                    <li className="logInOutButton"><a onClick={logoutHandler} style={{color:"black"}}>Logout</a></li>
                </ul>
            </div>
        )
          
      }

    
}

export default withRouter(Right);

