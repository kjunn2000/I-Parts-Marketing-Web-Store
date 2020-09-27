import React ,{ useState ,useEffect} from 'react';
import FileUpload from '../../utils/FileUpload';
import { Typography, Button , Form  , Input } from 'antd';
import Axios from 'axios';
import AdminNav from '../AdminNav/AdminNav.js';

const { Title } = Typography;
const { TextArea } = Input ;

const Categories = [
    {key:1,value:"AirFilter"},
    {key:2,value:"Oil"},
    {key:3,value:"OilFilter"},
]

const Brands = [
    {key:1,value:"Mannol"},
    {key:2,value:"Volkswagen Genuine"},
    {key:3,value:"SH Chemical"}
]

function UploadProductPage(props) {

    const [DefaultSelectedKey,setDefaultSelectedKey] = useState(["2"]);
    useEffect(() => {

        if(props.user.userData && props.user.userData.isAdmin==false){
            props.history.push('/product');
        }

    }, [props.user.userData])


    const [title,setTitle] = useState ("");
    const [brand,setBrand] = useState ("");
    const [description,setDesciption] = useState ("");
    const [price,setPrice] = useState (0);
    const [category,setCategory] = useState (1);

    const [Images,setImages] = useState ([]);

    const onChangeTitle =(e)=> {
        setTitle(e.currentTarget.value);
    }

    const onChangeBrand =(e)=> {
        setBrand(e.currentTarget.value);
    }

    const onChangeDescription =(e)=> {
        setDesciption(e.currentTarget.value);
    }

    const onChangePrice =(e)=> {
        setPrice(e.currentTarget.value);
    }

    const onChangeCategory =(e)=> {
        setCategory(e.currentTarget.value);
    }
     
    const handleSubmit =(e)=> {
        e.preventDefault();

        console.log("submit");
    }

    const updateImages = (newImages) =>{
        console.log(newImages)
        setImages(newImages)
    }

    const onSubmit = (event) => {
        event.preventDefault();


        if (!title || !description || !price ||
            !category || !Images) {
            return alert('fill all the fields first!')
        }

        const variables = {
            writer: props.user.userData._id,
            title: title,
            brand: brand,
            description: description,
            price: price,
            images: Images,
            category : category ,
        }

        Axios.post('/api/product/uploadProduct', variables)
            .then(response => {
                if (response.data.success) {
                    alert('Product Successfully Uploaded')
                    props.history.push('/product/upload')
                } else {
                    alert('Failed to upload Product')
                }
            })
            
    }

 
    return (
        <AdminNav DefaultSelectedKey={DefaultSelectedKey}> 
            <div className="uploadForm" style={{height:"auto" }}>
                
                <div style={{maxWidth:'700px',margin: ' 2rem auto'}}>
                    <div style = {{textAlign : 'center' ,marginBottom:'2rem'}}>
                        <Title level={2} className="formTitle"> Upload Product </Title> 
                    </div>    

                    <Form onSubmit={handleSubmit} className="form" style={{lineHeight:"50px",fontWeight:"bold",
                    fontFamily:"'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"}}>
                        <FileUpload refreshFunction={updateImages}/>
                        <label style={{fontSize:"14pt"}}>Title</label>    
                        <Input onChange={onChangeTitle} value={title}/>
                        <label style={{fontSize:"14pt"}}>Brand</label>
                        <br/>
                        <select onChange={onChangeBrand}>
                            {Brands.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <br/>
                        <label style={{fontSize:"14pt"}}>Description</label>
                        <TextArea onChange ={onChangeDescription} value = {description}/>
                        <label style={{fontSize:"14pt"}}>Price(RM)</label>
                        <Input onChange = {onChangePrice} value={price} type="number" />
                        <label style={{fontSize:"14pt"}}>Category</label>
                        <br/>
                        <select onChange={onChangeCategory}>
                            {Categories.map(item => (
                                <option key={item.key} value={item.key}>{item.value}</option>
                            ))}
                        </select>
                        <br/>
                        <Button type="primary" onClick={onSubmit} style={{height:"40px",width:"80px"}}>
                            Submit
                        </Button>
                    </Form>
                </div>          
                       
            </div>
        </AdminNav>
        
    )
}

export default UploadProductPage
