import React ,{useState,useEffect} from 'react'
import Axios from 'axios';
import './Sections/LandingPage.css';
import {  Col, Card, Row,message} from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import bestprice from '../../../assets/bestprice.png';
import newarrival from '../../../assets/newarrival.png';
import CarVideo from '../../../assets/Car(Audi).mp4';

const { Meta } = Card;

function LandingPage() {
    const [NewArrivalProducts, setNewArrivalProducts] = useState([])
    const [TopSalesProducts, setTopSalesProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [Filters, setFilters] = useState({
        topSales: true
    })
    
    useEffect(() => {
        
        const variablesNewArrival = {
            skip: Skip,
            limit: Limit,
            filters: {}           
        }
        const variablesTopSales = {
            skip: Skip,
            limit: Limit,
            filters: Filters,
            topSalesFlag : true
            
        }

        getNewArrivalProducts(variablesNewArrival)

        getTopSalesProducts(variablesTopSales)
        
    }, [])

    
    const getNewArrivalProducts = (variables) => {

        Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    setNewArrivalProducts(response.data.products)
                } else {
                    message.error('Failed to fectch product datas')
                }
            })
    }

    const getTopSalesProducts = (variables) => {
        Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    setTopSalesProducts(response.data.products)
                } else {
                    message.error('Failed to fectch product datas')
                }
            })
    }

    const renderNewArrivalCards = NewArrivalProducts.map((product, index) => {
        return (
            <Col className="productContainer" lg={6} md={8} xs={12} >
                    <img src={newarrival} alt="newarrival" className="newarrival"/>

                    <Card
                        className="Card"
                        hoverable={true}
                        style={{borderRadius:"10px"}}
                        cover={<a href={`/product/${product._id}`} > <ImageSlider images={product.images} className="Images"/></a>}
                    >
                        <Meta
                            className="Meta"
                            title={product.title}
                            description={`RM${product.price}`}
                        />
                    </Card>
            </Col>
        )
    })
    
    const renderTopSalesCards = TopSalesProducts.map((product, index) => {
        
        return (
            
            <Col  className="productContainer" lg={6} md={8} xs={12} >
                    <img src={bestprice} alt="bestprice" className="bestprice"/>

                    <Card
                        hoverable={true} 
                        style={{borderRadius:"10px"}}
                        cover={<a href={`/product/${product._id}`} > <ImageSlider images={product.images} /></a>}
                    >
                        <Meta 
                            title={product.title}
                            description={`RM${product.price}`}
                        />
                    </Card>
            </Col>
        )
    })


    return (
        <div className="landingPage">
            <div className="heroTitle">
                Find your part.<br/> Love our service.
                <br/>
                <button><a href="#about">About Us</a></button>
            </div>
            <div className="heroBack">
                <div className="heroBackLeft"></div>
                <div className="heroBackRight"></div>
            </div>
            <div className="about" id="about">
                <div className="aboutLeft">
                    <h2>About I Parts Marketing</h2>
                    <p> I Parts Marketing is one of the Malaysia’s leading online business company which specialised in supplying the premium quality auto parts for Audi, BMW, Mini cooper, Land Rover, Mercedes Benz, Porsche, Volvo and Volkswagen.</p>
                </div>
                <div className="aboutRight"></div>
                
            </div>
            <div className="product" id="product">
                <div className="productAreaLeft"></div>
                <div className="productAreaRight">
                    <div class="video-container">
                        <video loop autoPlay muted>
                            <source src={CarVideo} type="video/mp4"/>
                        </video>
                    </div>
                </div>
                <div className="productText">
                <h2>WHAT WE SELL ?</h2>
                        <p> We are offering genuine parts, OEM (Original Equipment Manufacturer)& premium AM (After Market) auto parts at competitive price with quality assurance.</p>
                        <button><a>Shop All</a></button>
                </div>
            </div>
            
            <div className="weekly">
                <div className="weeklyProduct new" >
                    <h2 className="weeklyProductTitle">New Arrival Product Of The Week</h2>
                    <br/><br/>
                    {NewArrivalProducts.length === 0 ?
                        <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                            <h2>No post yet...</h2>
                        </div> :
                        <div>
                            <Row gutter={[16, 16]}>

                                {renderNewArrivalCards}

                            </Row>


                        </div>
                    }
                </div>

                <div className="weeklyProduct best">
                    <h2 className="weeklyProductTitle">Top Sales Product Of The Week</h2>
                    <br/><br/>
                    {TopSalesProducts.length === 0 ?
                        <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                            <h2>No post yet...</h2>
                        </div> :
                        <div>
                            <Row gutter={[16, 16]}>

                                {renderTopSalesCards}

                            </Row>


                        </div>
                    }
                </div>

            </div>
            
        </div>
    )
}

export default LandingPage