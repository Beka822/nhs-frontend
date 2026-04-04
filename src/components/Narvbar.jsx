import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
export default function Navbar({user}) {
    const navigate=useNavigate()
    const logout=()=>{
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        navigate("/login")
    }
    return(
        <div className="flex justify-between items-center bg-white shadow px-6 py-4">
            {/*Page Title*/}
            <h1 className="text-xl font-semibold text-gray-800">
                Dashboard
            </h1>
            {/*User Info and Logout*/}
            <div className="flex items-center gap-4">
            {user &&(
                <>
                <span
                className="text-gray-700">{user?.full_name}</span>
                <span
                className="text-gray-500">({user?.role})</span>
                </>
            )}
            

                <button 
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                    Logout
                </button>
            </div>
            </div>
            
        )
        
}
