import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../state/authSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomWarning from "../Components/BottomWarning"
import Button from "../Components/Button"
import Heading from "../Components/Heading"
import InputBox from "../Components/InputComponent"
import SubHeading from "../Components/SubHeading"


export const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.auth.error,
  }));  
  console.log(isAuthenticated,"hell")

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  })

  const handleLogin = () => {
    dispatch(loginAsync({ username, password }))
      .unwrap()
      .then(() => {
        alert('Login successful');
        navigate('/dashboard');
      })
      .catch((err) => {
        alert(error);
      });
  };



    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Username" label={"Email"} />
        <InputBox  type="password"  onChange={(e) => setPassword(e.target.value)} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={handleLogin} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}