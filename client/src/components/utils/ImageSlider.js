import React from 'react'
import { Carousel } from 'antd';
import './Sections/ImageSlider.css';

function ImageSlider(props) {
    return (
        <div>

            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div key={index} className="image">
                        <img style={{ width: '100%' ,borderRadius:"10px"}}
                            src={`http://localhost:5000/${image}`} alt="productImage" />
                    </div>
                ))} 
            </Carousel>
        </div>
    )
}

export default ImageSlider