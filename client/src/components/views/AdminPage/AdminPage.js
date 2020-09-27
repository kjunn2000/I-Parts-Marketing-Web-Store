import React ,{ useState ,useEffect} from 'react';
import { Table, Tag, Radio , Modal ,Popconfirm,message,Button} from 'antd';
import AdminNav from '../AdminNav/AdminNav.js';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';

var Orders=[];
let Data = [];

function AdminPage(props) {
      const [DefaultSelectedKey,setDefaultSelectedKey] = useState(["1"]);
      const [Visible ,setVisible]=useState(false);
      const [ShippingNo,setShippingNo]= useState("");
      var listOfModal= [];
      var i =0;
      for(i=0 ; i<Orders.length; i++){
        listOfModal.push([`ModalVisibleOfIndex${i}`,false])
      }

      console.log(listOfModal);


      useEffect(() => {

          if(props.user.userData && props.user.userData.isAdmin==false){
              props.history.push('/product');
          }

          getOrders();


      }, [props.user.userData])

      function getOrders(){
        Axios.get('/api/users/getOrderRecord')
          .then(response => {
              if (response.data.success) {
                  
                  Orders = response.data.Order;
                  console.log(Orders);
                  
                  
              } else {
                  alert('Failed to get order details')
              }
          })
      }

      function sendShippingMail(dataToSubmit){
        Axios.post('/api/users/sendShippingMail',dataToSubmit)
          .then(response => {
              if (response.data.success) {
                  message.success("Shipping confirmation mail sent."); 
              } else {
                  alert('Failed to send.')
              }
          })
      }

      function completeOrder(dataToSubmit){
        Axios.post('/api/users/completeOrder',dataToSubmit)
          .then(response => {
              if (response.data.success) {
                  message.success("This order is completed."); 
              } else {
                  alert('Failed to send.')
              }
          })
      }

      function confirm(Order_id) {
        const dataToSubmit={
          _id:Order_id
        }
        completeOrder(dataToSubmit);
      }
      
      function cancel(e) {
        
      }
      const showModal = () => {
        setVisible(true)
      };
      
      const handleOk =(Email,Order_id) => {
        if(ShippingNo!=""){
          const dataToSubmit={
            email:Email,
            trackingNo:ShippingNo,
            _id:Order_id
          }
          sendShippingMail(dataToSubmit);
        }else{
          message.warn('Tracking Number format no correct.')
        }
        setVisible(false)
      };


      const handleChange = e =>{
        setShippingNo(e.target.value);
      }
    
    
    
    const renderOrders = () => (

      Orders && Orders.map(Order=> { 
        return(
          <tr key={Order._id}>
              <td>{Order.user[0].name}</td>
              <td>
                <a href={`/admin/order/${Order._id}`} >
                  {Order._id}
                </a>           
                </td>
                
              <td>{Order.data[0].address.line1+","+Order.data[0].address.city+","+Order.data[0].address.state}</td>
              <td>{Order.user[0].email}</td>
              <td>
                  {Order.status=="No Ship" ?        
                    <Tag color="orange">{Order.status}</Tag>
                  :
                  Order.status=="Shipped" ?
                    <Tag color="cyan">{Order.status}</Tag>
                  :
                  Order.status=="Completed" ?
                    <Tag  color="green">{Order.status}</Tag>
                  :
                  <Tag  color="red">{Order.status}</Tag>
                  }
              </td>
              <td>
                <Button type="primary" onClick={showModal}>
                  Shipping Detail
                </Button>
                <Modal
                  title="Basic Modal"
                  visible={Visible}
                  onOk={()=>handleOk(Order.user[0].email,Order._id)}
                  onCancel={()=>setVisible(false)}
                >
                    <h2>Traking number:</h2>
                    <input value={ShippingNo} onChange={handleChange} placeholder="Enter tracking number :" style={{width:"100%"}}/>
                </Modal>
                &nbsp;&nbsp;
                <Popconfirm
                title="Are you sure set it completed?"
                onConfirm={()=>confirm(Order._id)}
                onCancel={()=>cancel}
                okText="Yes"
                cancelText="No"
                >
                  <a href="#">Completed</a>
                </Popconfirm></td>
          </tr>
      )})
  )

  

 
    return (
        <AdminNav DefaultSelectedKey={DefaultSelectedKey}>
          <div>
              <table>
                  <thead>
                      <tr>
                          <th>Name</th>
                          <th>OrderID</th>
                          <th>Address</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                    {renderOrders()}
                </tbody>
              </table>
          </div>
        </AdminNav>
        
    )
}

export default withRouter(AdminPage);
