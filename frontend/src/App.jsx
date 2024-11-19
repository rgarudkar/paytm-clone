import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signup } from "./Pages/Signup";
import { Signin } from "./Pages/Signin";
import { Dashboard } from "./Pages/Dashboard";
import { SendMoney } from "./Pages/SendMoney";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { logout } from './state/authSlice';
import "./index.css"


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    if (!token) {
      dispatch(logout());
    }
  }, [dispatch]);
  console.log(isAuthenticated, "isAuth");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />} />
          <Route path="/signin" element={!isAuthenticated ? <Signin /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
