import React, { useEffect, useState } from 'react'
import { withRouter } from "react-router-dom";
import Axios from 'axios'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { resetPass } from "../../../../_actions/user_actions";
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
  const UserId = props.match.params.UserId

  useEffect(() => {
    console.log(UserId);
  }, [])

    return (
      <RainbowBackground>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Email is invalid')
                .required('Email is required'),
              password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {

                let dataToSubmit = {
                  userId : UserId,
                  email: values.email,
                  password: values.password,

                };

                dispatch(resetPass(dataToSubmit)).then(response => {
                    if (response.payload.success) {
                        alert("Account Update Successfully.")
                        props.history.push("/login");
                    } else {
                      alert(response.payload.message)
                    }
                  })
      
                setSubmitting(false);
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
                <div className="resetPassForm">
                <div className="app"> 
                  <h2 className="formTitle" style={{fontSize:"20pt"}}>Reset Your Password</h2>
                  <Form className="form"  {...formItemLayout} onSubmit={handleSubmit} >
      
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
      
                    <Form.Item required label="New Password" hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                      <Input
                        id="password"
                        placeholder="Enter your new password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.password && touched.password ? 'text-input error' : 'text-input'
                        }
                      />
                      {errors.password && touched.password && (
                        <div className="input-feedback">{errors.password}</div>
                      )}
                    </Form.Item>
      
                    <Form.Item required label="ConfirmPassword" hasFeedback>
                      <Input
                        id="confirmPassword"
                        placeholder="Enter your new password"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                        }
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="input-feedback">{errors.confirmPassword}</div>
                      )}
                    </Form.Item>
      
                    <Form.Item {...tailFormItemLayout}>
                      <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                        Submit
                      </Button>
                    </Form.Item>

                  </Form>
                </div>
                </div>
              );
              
            }}
          </Formik>
      </RainbowBackground>
    );
  };

export default withRouter(ResetPassPage)