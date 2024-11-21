import { useEffect, useState, useRef } from "react"
import Button from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const debounceTimeout = useRef(null);

    useEffect(() => {
        userSearch();
    }, [filter])

    const userSearch = async () => {
        try {
            const resp = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`);
            if (resp && resp.data) {
                setUsers(resp.data.user)
            }
        }
        catch (err) {
            alert(err.response.data.message);
        }
    }

    const filterUser = (e) => {
        const value = e.target.value;
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setFilter(value)
        }, 550)
    }

    return <>
        <div className="font-bold mt-6 text-lg">
            Users            Your balance
        </div>
        <div className="my-2">
            <input onChange={(e) => { filterUser(e) }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div className="overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 h-96">
            {users.map((user) => (
                <User key={user.id} user={user} />
            ))}
        </div>

    </>
}

function User({ user }) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} label={"Send Money"} />
        </div>
    </div>
}

