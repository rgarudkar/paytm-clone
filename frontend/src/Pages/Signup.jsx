import { useState } from "react"
import axios from "axios"
import BottomWarning from "../Components/BottomWarning"
import Button from "../Components/Button"
import Heading from "../Components/Heading"
import InputBox from "../Components/InputComponent"
import SubHeading from "../Components/SubHeading"
import { useNavigate } from "react-router-dom"

export const Signup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const signup = async () => {
       try{
        const resp = await axios.post("http://localhost:3000/api/v1/user/signup",
            {
                firstName,
                lastName,
                username,
                password
            }
        )
        if(resp && resp.data){
            localStorage.setItem("auth",resp.data.token);
            alert("Login succesfull");
            navigate("/dashboard");
        }
       }
       catch(err){
            alert(err);
       }
    }

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign up"} />
                <SubHeading label={"Enter your infromation to create an account"} />
                <InputBox onChange={(e) => setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
                <InputBox onChange={(e) => setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
                <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
                <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="123456" label={"Password"} />
                <div className="pt-4">
                    <Button onClick={signup} label={"Sign up"} />
                </div>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
            </div>
        </div>
    </div>
}