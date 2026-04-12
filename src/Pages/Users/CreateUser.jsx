import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../api/axios";
export default function CreateUser() {
    const navigate=useNavigate()
    const {hospital_id}=useParams()
    const [userId,setUserId]=useState("")
    const [fullName,setFullName]=useState("")
    const [role,setRole]=useState("")
    const [password,setPassword]=useState()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const token=localStorage.getItem("access_token")
        try {
            await api.post("/users/",
                {
                    user_id:userId,
                    full_name:fullName,
                    hospital_id:hospital_id,
                    role:role,
                    password:password
                },
                {
                    headers:{Authorization:`Bearer ${token}`}
                }
            )
            navigate(`/hospitals/${hospital_id}/users`)
        } catch (error){
            console.error(error)
            alert("Failed to create user")
        }
    }
    return(
        <div className="bg-white p-6 rounded shadow max-w-lg">
            <h1 className="text-xl font-bold mb-6">
                Create User
            </h1>
            <form onSubmit={handleSubmit}
            className="flex flex-col gap-4">
                <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e)=>
                    setUserId(e.target.value)
                }
                className="border p-2 rounded"
                required
                />
                <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e)=>
                    setFullName(e.target.value)
                }
                className="border p-2 rounded"
                required/>
                {/*Hospital ID auto-filled*/}
                <input
                type="text"
                value={hospital_id}
                className="border p-2 rounded bg-gray-100"
                disabled
                />
                <select
                value={role}
                onChange={(e)=>
                    setRole(e.target.value)
                }
                className="border p-2 rounded"
                required
                >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                    <option value="STAFF">Staff</option>
                </select>
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>
                    setPassword(e.target.value)
                }
                className="border p-2 rounded"
                required
                />
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create User
                </button>
            </form>
        </div>
    )
}