import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";
export default function Users({user}) {
    const {hospital_id}=useParams()
    const navigate=useNavigate()
    const [users,setUsers]=useState([])
    const fetchUsers=async ()=>{
        try {
            const res=await api.get(`/users?hospital_id=${hospital_id}`)
            setUsers(res.data)
        }catch (err) {
            console.error("Error fetching users:",err)
        }
    }
    useEffect(()=>{
        fetchUsers()
    },[])
    return(
        <div>
            {/*Header*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Hospital Users
                </h1>
                {(user?.role==="ADMIN"
                    || user?.role==="SUPER_ADMIN"
                ) && (
                    <button
                    onClick={()=>
                        navigate(`/hospitals/${hospital_id}/users/create`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Register User
                    </button>
                )}
            </div>
            {/*Users Table*/}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table
                className="w-full">
                    <thead
                    className="bg-gray-100">
                        <tr>
                            <th
                            className="text-left px-6 py-3">User ID</th>
                            <th
                            className="text-left px-6 py-3">Full Name</th>
                            <th
                            className="text-left px-6 py-3">Role</th>
                            <th
                            className="text-left px-6 py-3">Action</th>
                            </tr>
                    </thead>
                    <tbody>
                        {users.map((u)=>(
                            <tr key={u.user_id}
                            className="border-t">
                                <td
                                className="px-6 py-4">{u.user_id}</td>
                                <td
                                className="px-6 py-4">{u.full_name}</td>
                                <td
                                className="px-6 py-4">{u.role}</td>
                                <td
                                className="px-6 py-4">
                                    <button
                                    className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-black">
                                        View
                                    </button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}