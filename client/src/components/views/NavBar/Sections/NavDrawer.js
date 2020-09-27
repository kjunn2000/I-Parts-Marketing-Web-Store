import React ,{useState} from 'react'
import './Navbar.css';
import {Button,Drawer, Icon , Badge} from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";


import {
    MenuFoldOutlined,
    MenuOutlined 
  } from '@ant-design/icons';

function NavDrawer(props) {

    const [Collapsed , setCollapsed] = useState(true);
    const [Visible , setVisible] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!Collapsed);
    };

    const showDrawer = () => {
        setVisible(true)
      };

    const onClose = () => {
        setVisible(false)
      };

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

    return (
        <div>
            <div className="nav-responsive">
                    <Button type="primary" onClick={toggleCollapsed,showDrawer} >
                        {Collapsed ? <MenuOutlined />
                        :
                        <MenuFoldOutlined/> }
                    </Button>
                    {
                        Collapsed ? 

                        <Drawer title="Menu"
                                placement="left"
                                closable={false}
                                onClose={onClose}
                                visible={Visible}
                                style={{backgroundColor: "rgba(105, 105, 105, 0.8)"}}>
                                <ul style={{fontSize:"12pt", listStyle:"none",lineHeight:"70px"}}>
                                    <li><a className="nav-title" href="/" style={{color:"black"}}>Home</a></li>
                                    <li><a className="nav-title" href="/product"  style={{color:"black"}}>Product</a></li>
                                    {
                                        (user.userData && !user.userData.isAuth) 
                                        ?
                                        <div>
                                            <li><a className="nav-title" href="/register"  style={{color:"black"}}>Become A Member</a></li>
                                            <li className="logInOutButton"><a href="/login"  style={{color:"black"}}>Buy now</a></li>
                                        </div>
                                        
                                        :
                                        
                                        (user.userData && user.userData.role==1)
                                        ?
                                        <div>
                                            <li><a className="nav-title" href="/product/upload" style={{color:"black"}}>Upload</a></li>
                                            <li className="logInOutButton"><a onClick={logoutHandler} style={{color:"black"}}>Logout</a></li>
                                        </div>
                                        :


                                        <div>
                                            <li><a className="nav-title" href="/history" style={{color:"black"}}>History</a></li>
                                            <li>
                                                <Badge count={user.userData && user.userData.cart.length}>
                                                    <a href="/user/cart" style={{ color: '#66777'}}>
                                                        <Icon type="shopping-cart" style={{fontSize: 30 ,color:"black"}}/>
                                                    </a>
                                                </Badge>
                                            </li>
                                            <li className="logInOutButton"><a onClick={logoutHandler} style={{color:"black"}}>Logout</a></li>
                                        </div>
                                            

                                        
                                        
                                        
                                
                                    }
                                </ul>
                        </Drawer>
                        : 
                        <div>Close</div>
                    }
                </div>
        </div>
    )
}

export default withRouter(NavDrawer)
