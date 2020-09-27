import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card, Row,Drawer, Button } from 'antd'; 

import ImageSlider from '../../utils/ImageSlider';
import {CategoryCheckBox,BrandCheckBox} from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import {categories,price,brand} from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';
import './Sections/ProductPage.css';


const { Meta } = Card;

function ProductPage(props) {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()
    const [Filters, setFilters] = useState({
        category:[],
        price:[],
        brand:[]
    })
    const [SearchTerms, setSearchTerms] = useState("");

    const [visibleDrawer, setVisibleDrawer] = useState(false);

    const showFilterDrawer = () => {
        setVisibleDrawer(true);
      };
    
    const onCloseFilterDrawer = () => {
        setVisibleDrawer(false);
    };


    useEffect(() => {
        console.log(props.user.userData);
        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getProducts(variables)

    }, [])

    

    const getProducts = (variables) => {
        Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    if (variables.loadMore) {
                        setProducts([...Products, ...response.data.products])
                    } else {
                        setProducts(response.data.products)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fectch product datas')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }
        getProducts(variables)
        setSkip(skip)
    }


    const renderCards = Products.map((product, index) => {

        return <Col className="productContainer" lg={6} md={8} xs={12}>
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
    })

    const showFilteredResults= (filters) => {

        const variables = {
            skip:0,
            limit: Limit,
            filters:filters

        }
        getProducts(variables)
        setSkip(0)


    }

    const handlePrice=(value)=>{

        const data = price;
        let array = [];

        for (let key in data ) {
            
            if(data[key]._id === parseInt(value,10)){
                array = data[key].array;
            }

        }
        return array
    }

    const handleFilters = (filters,category) => {

        const newFilters = {...Filters}

        newFilters[category] = filters

        if(category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category]= priceValues

        }

        showFilteredResults(newFilters)
        setFilters(newFilters)

    }

    const updateSearchTerms = (newSearchTerm) =>{
        
        setSearchTerms(newSearchTerm)

        const variables = {
            skip: 0,
            limita: Limit,
            filters: Filters,
            searchTerm : newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)


    }

    const filterBlock =
            <div className="filterBlock" >
                <h2 className="filterSlogan">Find Your Part</h2>
                <div style={{paddingBottom:"20px"}}>
                    <SearchFeature refreshFunction={updateSearchTerms} />
                </div>
                <Row gutter={[16,16]}>
                    <Col lg={24} xs={24}>
                        <CategoryCheckBox list={categories} handleFilters={filters=>handleFilters(filters,"category")}/>
                    </Col>
                    <Col lg={24} xs={24}>
                        <BrandCheckBox list={brand} handleFilters={filters=>handleFilters(filters,"brand")}/>
                    </Col>
                    <Col lg={24} xs={24}>
                        <RadioBox list={price} handleFilters={filters=>handleFilters(filters,"price")}/>
                    </Col>
                </Row>
            
            </div>

    const mobileFilterBlock =
        <div>
            <Button type="primary" onClick={showFilterDrawer}>
                Filter
            </Button>
            <Drawer
            title="Choose your parts"
            placement="right"
            closable={false}
            onClose={onCloseFilterDrawer}
            visible={visibleDrawer}
            >
                {filterBlock}
            </Drawer>
        </div>
    
    


    return (
        <div className="productPage" style={{display:'flex'}}>

            {filterBlock}
            
            <div className="productContainer" >
                <div style={{ textAlign: 'center' }}>
                    <h2 className="heroTitle">  Wel  <Icon type="shopping" />ome to I Parts </h2>
                </div>
                <div className="announcementArea">
                    <p>*No shipping fee at MCO period*</p>    
                </div>
                <br/>
                <br/>

               
                
                <div className="mobileFilterBlock">
                    {mobileFilterBlock}
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <SearchFeature refreshFunction={updateSearchTerms} />
                    </div>
                </div>
                {Products.length === 0 ?
                    <div style={{ display: 'flex', float:'center',height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                        <h2>No post yet...</h2>
                    </div> :
                    <div>
                        <Row gutter={[16, 16]} >

                            {renderCards}

                        </Row>


                    </div>
                }
                <br /><br />

                {PostSize >= Limit &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={onLoadMore}>Load More</button>
                    </div>
                }


            </div>
        </div>

    )
}

export default ProductPage