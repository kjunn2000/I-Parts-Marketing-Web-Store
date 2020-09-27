import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import ProductPage from "./views/ProductPage/ProductPage";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import Nav from "./views/NavBar/Nav";
import Footer from "./views/Footer/Footer";
import UploadProductPage from './views/UploadProductPage/UploadProductPage';
import DetailProductPage from './views/DetailProductPage/DetailProductPage';
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';
import ResetPage from './views/LoginPage/Sections/ResetPage';
import ResetPassPage from './views/LoginPage/Sections/ResetPassPage';
import AdminPage from './views/AdminPage/AdminPage';
import DetailOrderPage from './views/AdminPage/Sections/DetailOrderPage';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <Nav/>
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/product" component={Auth(ProductPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />\
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          <Route exact path="/reset" component={Auth(ResetPage, false)} />
          <Route exact path="/reset/:UserId" component={Auth(ResetPassPage, false)} />
          <Route exact path="/admin" component={Auth(AdminPage, true)} />
          <Route exact path="/admin/order/:orderId" component={Auth(DetailOrderPage, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense> 
  );
}

export default App;
