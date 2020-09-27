import React  from 'react'
import { withRouter } from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { sentLink, getUserId } from "../../../../_actions/user_actions";
import RainbowBackground from "../../../utils/RainbowBackground";
import {
    Form,
    Input,
    Button,
  } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function ResetPassPage(props) {

    const dispatch = useDispatch();

    const  fetchUserId = (dataToSubmit) => {
        setTimeout(()=>{
          dispatch(getUserId(dataToSubmit)).then(response => {
            if(response.payload.success) {                

              let userId = response.payload.userId ;

              console.log("UserId = "+userId)
              

              dataToSubmit = {
                userId : userId,
                email: dataToSubmit.email
              };
                          

              dispatch(sentLink(dataToSubmit)).then(response => {
                  if (response.payload.success) {
                      alert("Please Verify Your Account At Your Mailbox.")
                  } else {
                    alert("Error")
                  }
                }) 
              

            }else{
              alert(response.payload.message);
              return new Error("response.payload.message")
            }
          })
        },500)
    }

    return (
      <div className="resetForm" style={{padding:"0px"}}>
        <RainbowBackground>

          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Email is invalid')
                .required('Email is required'),

            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {

                console.log(values.email)

                let dataToSubmit = {
                  email: values.email,
                };

                console.log(dataToSubmit)

                fetchUserId(dataToSubmit);

                setSubmitting(false);

                props.history.push("/login")
              }, 500);
            }}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
              } = props;

              return (
                
                <div className="app" >
                  <h2 className="formTitle" >Reset Your Account</h2>
                  <Form className="form" {...formItemLayout} onSubmit={handleSubmit} style={{ width: '300px' }} >
                    <h5>The reset password notification will send to you via email , please checking your mailbox for verify your account.</h5>
                    <Form.Item required label="Email" hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                      <Input
                        id="email"
                        placeholder="Enter your Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.email && touched.email ? 'text-input error' : 'text-input'
                        }
                      />
                      {errors.email && touched.email && (
                        <div className="input-feedback">{errors.email}</div>
                      )}
                    </Form.Item>
      
                    
      
                    <Form.Item {...tailFormItemLayout}>
                      <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                        Submit
                      </Button>
                    </Form.Item>

                  </Form>
                </div>
              );
            }}
          </Formik>
        </RainbowBackground>
    </div>

  
      
    );
  };

export default withRouter(ResetPassPage)