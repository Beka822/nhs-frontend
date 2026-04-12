import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
export default function Login() {
    const navigate=useNavigate()
    const [formData,setFormData]=useState({
        user_id:"",
        password:""
    })
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(false)
    const handleChange=(e)=>{
        setFormData({
            ...formData,[e.target.name]:e.target.value
        })
    }
    const handleLogin=async (e)=>{
        e.preventDefault();
        setLoading(true)
        setError("")
        try{
            //login
            const res=await api.post("/auth/login",{
                user_id: formData.user_id,
                password: formData.password
            })
            const data=res.data
            const {access_token,refresh_token}=data ;
            localStorage.setItem("access_token",access_token)
            localStorage.setItem("refresh_token",refresh_token)
            localStorage.setItem("hospital_id",data.hospital_id);
            localStorage.setItem("role",data.role);
            window.location.href="/hospitals";
            //get user info
            console.log("Using API instance, baseURL:",import.meta.env.VITE_API_URL);
            const userRes=await api.get("/users/me",{
                headers:{Authorization: `Bearer ${access_token}`}
            });
            const user=userRes?.data;
            console.log("USER RESPONSE:",userRes.data);
            localStorage.setItem("full_name",user.full_name || "");
            localStorage.setItem("role",user.role || "");
            //redirect based on role
            if (user.role==="SUPER_ADMIN"){
                navigate("/hospitals")
            }else if (user.role==="ADMIN"){
                navigate(`/hospitals/${user.hospital_id}`)
            } else {
                navigate("/dashboard")
            }
        }catch(err){
            console.error("Login error:",err.response?.data || err.message || err);
            setError("Invalid user_id or password")
        }
        setLoading(false)
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Universal Electronic Health System
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Secure Hospital Access
                </p>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                        </div>
                )}
                <form onSubmit={handleLogin}
                className="space-y-5">
                    <div>
                        <label className="block text-gray-600 mb-1">
                            User ID
                        </label>
                        <input
                        type="text"
                        name="user_id"
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Logging in..." :"Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}