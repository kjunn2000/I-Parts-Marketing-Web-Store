import React  from 'react'
import './Sections/Navbar.css';
import Left from './Sections/Left';
import Right from './Sections/Right';
import NavDrawer from './Sections/NavDrawer';
import IPartsLogo from '../../../assets/IPartsLogo.png';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";


function Nav(props) {
    const user = useSelector(state => state.user)

    if (user.userData && user.userData.role===1){
        return (

            <div></div>
            
        )
    
    }else if (props.location.pathname=="/login"){
        return(
            <div className="header" style={{backgroundColor:"black"}} >
                <div className="nav" style={{display:"flex",borderBottom:0}}>
                    <div className="middle" style={{textAlign:"center"}}>
                        <h1>I P<img src={IPartsLogo} alt="logo" style={{width:"40px",height:"40px"}}/>rts Marketing</h1>
                    </div>
                </div>
            </div>   
        )

    }else{
       
        return (
            <div className="header" style={{padding:"10px"}}>
                <div className="nav" >
                    <div className="nav-responsive">
                        <NavDrawer />
                    </div>
                
                    <Left className="left"/>
                    <div className="middle">
                        <h1>I P<img src={IPartsLogo} alt="logo" style={{width:"40px",height:"40px"}}/>rts Marketing</h1>
                        <h4>2004</h4>
                    </div>
                    <Right className="right"/> 
                </div>
            </div>   
        )   
      } 
}

export default withRouter(Nav);
