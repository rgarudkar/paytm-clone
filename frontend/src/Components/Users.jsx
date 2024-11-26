import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "./Button";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const debounceTimeout = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        userSearch();
    }, [filter]);

    const userSearch = async () => {
        try {
            const token = localStorage.getItem("auth");
            const headers = { Authorization: `Bearer ${token}` };

            const resp = await axios.get(
                `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
                { headers }
            );

            if (resp && resp.data) {
                setUsers(resp.data.users);
            }
        } catch (err) {
            alert(err.response?.data?.message || "An error occurred");
        }
    };

    const filterUser = (e) => {
        const value = e.target.value;
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setFilter(value);
        }, 550);
    };

    return (
        <>
            {/* Tab Navigation */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <div
                    className="px-4 py-2 cursor-pointer border-b-2 border-blue-500 text-blue-500"
                    onClick={() => navigate("/users")}
                >
                    Users
                </div>
                <div
                    className="px-4 py-2 cursor-pointer text-gray-500 hover:text-blue-500"
                    onClick={() => navigate("/transactions")}
                >
                    Previous Transactions
                </div>
            </div>

            {/* Users List */}
            <div className="my-2">
                <input
                    onChange={filterUser}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div className="overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 h-96">
                {users && users.length > 0 ? (
                    users.map((user) => <User key={user._id} user={user} />)
                ) : (
                    <p>Users not found</p>
                )}
            </div>
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between border-b py-2">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <Button
                    onClick={() =>
                        navigate("/send?id=" + user._id + "&name=" + user.firstName)
                    }
                    label={"Send Money"}
                />
            </div>
        </div>
    );
}