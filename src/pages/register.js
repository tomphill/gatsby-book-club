import React, { useState, useContext, useEffect } from "react"
import {Form, Input, Button, ErrorMessage} from '../components/common';
import {FirebaseContext} from '../components/Firebase';

const Register = () => {
  const {firebase} = useContext(FirebaseContext);
  const [errorMessage, setErrorMessage] = useState('');

  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    }
  }, [])

  function handleInputChange(e){
    e.persist();
    setErrorMessage('');
    setFormValues(currentValues => ({
      ...currentValues,
      [e.target.name]: e.target.value
    }))
  }

  function handleSubmit(e){
    e.preventDefault();

    if(formValues.password === formValues.confirmPassword){
      firebase.register({
        username: formValues.username,
        email: formValues.email,
        password: formValues.password
      }).catch(error => {
        if(isMounted) {
          setErrorMessage(error.message);
        }
      })
    }else{
      setErrorMessage('Password and Confirm Password fields must match')
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input onChange={handleInputChange} value={formValues.username} placeholder="username" type="text" required name="username" />
      <Input onChange={handleInputChange} value={formValues.email} placeholder="email" type="email" required name="email" />
      <Input onChange={handleInputChange} value={formValues.password} placeholder="password" type="password" required minLength={6} name="password" />
      <Input onChange={handleInputChange} value={formValues.confirmPassword} placeholder="confirm password" type="password" required minLength={6} name="confirmPassword" />
      {!!errorMessage &&
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      }
      <Button type="submit" block>
        Register
      </Button>
    </Form>
  )
}

export default Register;