import { useEffect,useState } from "react";
import { Appbar } from "../Components/Appbar"
import { Balance } from "../Components/Balance"
import { Users } from "../Components/Users"
import axios from "axios";

export const Dashboard = () => {
    const [balance,setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const resp = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth")
                    }
                });
                if (resp && resp.data) {
                    setBalance(resp.data.balance);
                }
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        };

        fetchBalance();
    }, []);

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance.toFixed(2)} />
            <Users />
        </div>
    </div>
}