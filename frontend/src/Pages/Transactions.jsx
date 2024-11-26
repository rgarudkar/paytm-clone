import React,{useEffect, useState} from "react";
import axios from "axios";
import TransactionCard from "../Components/TransactionCard"

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(()=>{
        fetchTransactions();
    },[]);

    const fetchTransactions = async() => {
        try{
            const token = localStorage.getItem("auth");
            const headers = { Authorization: `Bearer ${token}` };

            const resp = await axios.get("http://localhost:3000/api/v1/account/transactions",{headers});
            
            if(resp && resp.data){
                setTransactions(resp.data.transactions);
            }
        }
        catch(err){
            alert(err.response?.data?.message || "An error occurred");
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Previous Transactions</h1>
            <div className="overflow-y-scroll h-[34rem] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                {transactions && transactions.length > 0 ? (
                    transactions.map((txn) => <TransactionCard key={txn._id} transaction={txn} />)
                ) : (
                    <p>No transactions found</p>
                )}
            </div>
        </div>
    );
}