import React from 'react';
import {Button} from 'antd';
import '../../../utils/Sections/Rainbow.css';

function UserCardBlock(props) {

    const renderCartImage = (images) =>{
        if(images.length>0) {
            let image = images[0]
            return  `http://localhost:5000/${image}`
        }
    }

    
    const renderItems = () => (


        props.products && props.products.map(product => (
            <tr key={product._id}>
                <td><a href={`/product/${product._id}`} >{product.title}</a></td>
                <td>
                    <img className="checkOutImg" alt="product" src={renderCartImage(product.images)}/>
                </td> 
                <td>{product.quantity}</td>
                <td>RM{product.price}</td>
                <td><Button type="danger" className="removeButton" onClick={()=>props.removeItem(product._id)}>Remove</Button></td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
