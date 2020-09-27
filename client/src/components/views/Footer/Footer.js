import React , {useState} from 'react'
import './Sections/Footer.css';
import Facebook from '../../../assets/Facebook.png'
import shopee from '../../../assets/shopee.png'
import Gmail from '../../../assets/Gmail.png'
import lazada from '../../../assets/lazada.jfif'
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";


function Footer(props) {


      const [Email, setEmail] = useState("");

      const onChangeEmail = (e) => {
            setEmail(e.target.value)
      }

      const onSubscribe = (e) => {
            e.preventDefault()
            
            let dataToSubmit = {
                  email: Email
            }

            Axios.post(`/api/users/subscribe`,dataToSubmit)
                  .then(alert("Our professional customer service wil keep in touch with you in this few hour"))
            setEmail("");

      }

      const user = useSelector(state => state.user)

      if ((user.userData && user.userData.role==1 )||(props.location.pathname=="/login") ){
            return (
                  <div></div>
            )
      
            }else {
            
                  return (
                        <div className="footer">
                              <div className="footer-top">
                                          <div className="container">
                                                <div className="row">
                                                      <div className="segment-one">
                                                            <h2>I Parts Marketing</h2>
                                                            <p>As a Malaysia’s leading automotive company , we are selling all kinds of the products related to automotive . 
                                                                  Quality is in our parts. Find your part. Love our service.</p>
                                                      </div>
                                                      <div className="segment-two">
                                                            <h2>Useful Link</h2>
                                                            <ul>
                                                                  <li>
                                                                  <a href="/">Home </a></li>
                                                                  <li><a href="/product">Product</a></li>
                                                                  <li><a href="/login">Login</a></li>
                                                                  <li><a href="/register">Register</a></li>
                                                            </ul>
                                                      </div>							
                                                      <div className="segment-three">
                                                            <h2>Follow Us</h2>
                                                            <p>Please Follow us on our Social Media Profile in order to keep updated .We will update the promotion date or event at these platform .</p>
                                                            <div className="icons">
                                                                  <a href="https://www.facebook.com/pacificvehicle.components.3" target="_blank" ><img src={Facebook} alt=""/></a>
                                                                  <a href="https://mail.google.com/" target="_blank"><img src={Gmail} alt=""/></a>
                                                                  <a href="https://shopee.com.my/shop/230167352/" target="_blank"><img src="img/Gmail.png" src={shopee} alt=""/></a>
                                                                  <a href="https://www.lazada.com.my/shop/i-parts-marketing/?spm=a2o4k.pdp.seller.1.22296ee5sz1XJX&itemId=983318727&channelSource=pdp" target="_blank"><img src="img/Snapchat.png" src={lazada} alt=""/></a>
                  
                                                            </div>
                                                                        
                                                      </div>
                                                      <div className="segment-four">
                                                            <h2>Contact Us</h2>
                                                            <p>If you have any question , please don't hesitate to contact us.</p>
                                                            <form onSubmit={onSubscribe}>
                                                                  <input type="email" value={Email} required onChange={onChangeEmail} placeholder="Email:" style={{color:"black"}}/>
                                                                  <input type="submit" value="subscribe" />                  
                                                            </form>
                                                      </div>
                                                </div>
                                          </div>
                              </div>
                              <div className="footer-middle">
                                    <div className="segment-middle">
                                          <h2>Payment Method</h2>
                                          <p>We accept all the payment method.</p>
                                          {/* <div className="icons">
                                                <a href="#" ><img src={Facebook} alt=""/></a>
                                                <a href="#"><img src={Gmail} alt=""/></a>
                                                <img src="img/Gmail.png" src={shopee} alt=""/>
                                                <img src="img/Snapchat.png" src={lazada} alt=""/>
                                          </div> */}
                                                                        
                                    </div>
                              </div>
                              <div className="footer-bottom">
                                    &copy; ipartsmarketing.com | Designed by MOODY JUN
                              </div>
                        </div>
            )
            } 

      
}




export default withRouter(Footer);
