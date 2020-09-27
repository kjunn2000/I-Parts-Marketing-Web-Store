const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Order } = require("../models/Order");
const { Product } = require('../models/Product');
const { auth } = require("../middleware/auth");
const { Payment } = require('../models/Payment');
const moment = require("moment");
const nodemailer = require("nodemailer");
const async = require('async');

require('dotenv').config();


router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
    
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.get('/addToCart', auth, (req, res) => {

    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        console.log(userInfo)

        userInfo.cart.forEach((item) => {
            if (item.id == req.query.productId) {
                duplicate = true;
            }
        })


        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.query.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
});


router.get('/removeFromCart', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query._id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })
        }
    )
})


router.get('/userCartInfo', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })


            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, cartDetail, cart })
                })

        }
    )
})




router.post('/successBuy', auth, (req, res) => {
    let history = [];
    let transactionData = {};
    let orderData = {};
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    //1.Put brief Payment Information inside User Collection 
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: date,
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2.Put Payment Information that come from Paypal into Payment Collection 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history;
    orderData=transactionData;
    

    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });

            const order = new Order (orderData)
            order.save((err,doc)=> {
                if(err) return res.json({sucess:false ,err})
            })
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                //3. Increase the amount of number for the sold information 

                //first We need to know how many product were sold in this transaction for 
                // each of products

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                // first Item    quantity 2
                // second Item  quantity 3

                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })

            })
        }
    )
})


router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})

router.post('/getUserId',(req,res)=> {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (user){
            console.log(user._id);
            return res.status(200).json({
                success: true,
                userId: user._id
            });
        }
        else{
            return res.json({
                success: false,
                message: "Auth failed. This email address not register yet."
            })
        }
    });
})


router.post('/reset',(req,res)=> {

    let link = `http://localhost:3000/reset/${req.body.userId}`

    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
        port: 587,
        secure: false, 
        });

    let body ={
        from: "ipartscustomerservice@gmail.com",
        to: req.body.email,
        subject: "Reset Password ✔", 
        text: "Please Click the link bellow to reset your password.", 
        html: `<h2>Thanks for Contact Us<h2/>
                <h3>Please Click the link bellow to reset your password<h3/><br/>
               <a href=${link}>${link}</a> `
    }

    transporter.sendMail(body,(err,result)=>{
        if(err) {
            console.log(err);
            return false
        }
        console.log(result);    
    })


    return res.status(200).json({
        success: true
    });


})

router.post("/resetpass",  (req, res) => {
    User.findOneAndDelete({ _id:req.body.userId , email: req.body.email }, (err, user) => {
         
        if (!user){

            return res.json({
                success: false,
                message: "Auth failed. This email address not register yet."
            })
            
        }
        else{
            let dataToSubmit = {
                email: user.email,
                password: req.body.password,
                name: user.name,
                lastname: user.lastname,
                cart: user.cart,
                history: user.history,
                image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
              };

            const newUser = new User(dataToSubmit);

            newUser.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({
                    success: true
                });
            });
        
        }
    });
});


router.post("/subscribe", (req, res) => {

    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
        port: 587,
        secure: false, 
        });

    let body ={
        from: "ipartscustomerservice@gmail.com",
        to: req.body.email,
        subject: "Contact Us ✔", 
        text: "Thank you for Contact Us .", 
        html: `<h2 style="color:#9fa8a3">Thanks for Contact Us<h2/>
                <h3>Our professional customer service wil keep in touch with you in this few hour ,
                 thank you for your patient waiting.</a> `
    }

    transporter.sendMail(body,(err,result)=>{
        if(err) {
            console.log(err);
            return false
        }
        console.log(result);    
    })


    return res.status(200).json({
        success: true
    });

});

router.get('/getOrderRecord',(req,res)=> {
    Order.find()
        .exec((err,Order)=> {
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true,Order})
        })
})


router.post("/sendShippingMail", (req, res) => {

    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
        port: 587,
        secure: false, 
        });

    let body ={
        from: "ipartscustomerservice@gmail.com",
        to: req.body.email,
        subject: "Contact Us ✔", 
        text: "Thank you for shopping in our shop .", 
        html: `<h2 style="color:#9fa8a3">Thank you for shopping in our shop <h2/>
                <h3>This is your tracking number <h1 style="color:red">${req.body.trackingNo}</h1> of your order , please waiting two until five day waiting for shipping.
                We are welcome for your to contact us if you have any issue.</a> `
    }

    transporter.sendMail(body,(err,result)=>{
        if(err) {
            console.log(err);
            return false
        }
        console.log(result);    
    })

    Order.findOneAndUpdate({ _id: req.body._id }, { status: "Shipped" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });



});

router.post("/completeOrder", (req, res) => {


    Order.findOneAndUpdate({ _id: req.body._id }, { status: "Completed" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });



});

router.post("/getOrderRecord/orderDetail", (req, res) => {

    Order.findOne({ _id: req.body._id},(err, orderData) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true,
            order:orderData
        });
    });



});


module.exports = router;
