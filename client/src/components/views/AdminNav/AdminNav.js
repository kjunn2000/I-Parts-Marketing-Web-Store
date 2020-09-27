import React,{useState}  from 'react'
import { Layout, Menu,Modal} from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../Config';
import { withRouter } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  UploadOutlined,
  PoweroffOutlined 
} from '@ant-design/icons';
import IPartsLogo from '../../../assets/IPartsLogo.png';
import './Sections/AdminNav.css';

const { Header, Sider, Content } = Layout;
function AdminNav(props) {

    const [Collapsed,setCollapsed] =useState(true);

    const toggle = () => {
        setCollapsed(!Collapsed);
    }

    function confirm() {
        Modal.confirm({
          title: 'Confirm',
          icon: < PoweroffOutlined />,
          content: 'Are you sure to log out?',
          okText: 'Confirm',
          onOk:logoutHandler,
          cancelText: 'Cancel',
        });

        
      }

    const logoutHandler = () => {
        axios.get(`${USER_SERVER}/logout`).then(response => {
        if (response.status === 200) {
            props.history.push("/product");
        } else {
            alert('Log Out Failed')
        }
        });
    };

      
    return (
        <Layout className="adminNav">
          <Sider trigger={null} collapsible collapsed={Collapsed}>
            <div className="logo" ><img src={IPartsLogo} alt="logo"/></div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={props.DefaultSelectedKey}>
              <Menu.Item key="1">
                {Collapsed ? <a href="/admin"><UserOutlined /></a> :  <a href="/admin">Manage Order</a> }
              </Menu.Item>
              <Menu.Item key="2">
                {Collapsed ? <a href="/product/upload"><UploadOutlined /></a> :  <a href="/product/upload">Upload</a> }
              </Menu.Item>
              <Menu.Item key="3">
                {Collapsed ? <a onClick={confirm}><PoweroffOutlined /></a> :  <a onClick={confirm}>Log Out</a> }
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-header" style={{ padding: 0 ,color:"white"}}>
                <div className="toggleButton">
                    {React.createElement(Collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                      className: 'trigger',
                      onClick: toggle,
                      })}
                </div>
                <h2>I Parts Seller Center</h2>
            </Header>
            <Content
            className="site-layout-content"
            
          >
            {props.children}
          </Content>
          </Layout>
        </Layout>
      );
}

export default withRouter(AdminNav);
