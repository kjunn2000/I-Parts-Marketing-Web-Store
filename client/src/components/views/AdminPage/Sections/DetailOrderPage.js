import React ,{useState,useEffect}from 'react';
import AdminNav from '../../AdminNav/AdminNav';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';

var Order = [];

function DetailOrderPage(props) {
    const orderId = props.match.params.orderId;
    const [DefaultSelectedKey,setDefaultSelectedKey] = useState(["1"]);
    
    useEffect(() => {

      const dataToSubmit={
        _id:orderId
      }


      Axios.post('/api/users/getOrderRecord/orderDetail',dataToSubmit)
          .then(response => {
              if(response.data.success){
                Order=response.data.order;
                console.log(Order);
              }
          })
       }, [])



    const renderDetails = () => {
      console.log(Order);
      return (
        Order.product && Order.product.map(item=>{ 
          return(
          <tr key={item.id} >
            <td>{item.dateOfPurchase}</td>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.paymentId}</td>
          </tr>
        )})
      )
    }
  
  


    return (
        <AdminNav DefaultSelectedKey={DefaultSelectedKey}>
          <div style={{display:"flex",padding:"30px"}}>
            <h2 style={{display:"flex"}}>Order ID : </h2>
            <h2 style={{display:"flex"}}>{Order._id}</h2>
          </div>
          <table key={Order._id}>
              <thead>
                  <tr>
                      <th>DateOfPurchase</th>
                      <th>ProductID</th>
                      <th>ProductName</th>
                      <th>Quantity</th>
                      <th>PaymentID</th>
                  </tr>
              </thead>
              <tbody>
                  {renderDetails()}
              </tbody>
          </table> 
        </AdminNav>
        
    )
}

export default withRouter(DetailOrderPage);


