import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
export default function Wards() {
    const {hospital_id}=useParams()
    const navigate=useNavigate()
    const [wards,setWards]=useState([])
    useEffect(()=>{
        fetchWards()
    },[])
    const fetchWards=async ()=>{
        const token=localStorage.getItem("access_token")
        try{
            const response=await api.get(`/wards?hospital_id=${hospital_id}`,
                {
                    headers:{Authorization:`Bearer ${token}`}
                }
            )
            setWards(response.data)
        } catch (error) {
            console.error("Error loading wards",error)
        }
    }
    return(
        <div>
            {/*Header*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">
                    Hospital Wards
                </h1>
                <button 
                onClick={()=>navigate(`/hospitals/${hospital_id}/wards/create`)}
                className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Ward
                </button>
            </div>
            {/*WARDS TABLE*/}
            <div className="bg-white shadow rounded">
                <table className="w-full">
                    <thead className="border-b bg-gray-50">
                        <tr className="text-left">
                            <th className="p-3">Ward ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Capacity</th>
                            <th className="p-3">Floor</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wards.map((ward)=>(
                            <tr
                            key={ward.ward_id}
                            className="border-b hover:bg-gray-50">
                                <td
                                className="px-4 py-2">{ward.ward_id}</td>
                                <td
                                className="px-4 py-2">{ward.name}</td>
                                <td
                                className="px-4 py-2">{ward.ward_type}</td>
                                <td
                                className="px-4 py-2">{ward.capacity}</td>
                                <td
                                className="px-4 py-2">{ward.floor}</td>
                                <td className="px-4 py-2">{ward.is_active ? "Active" : "Inactive"}</td>
                                <td className="px-4 py-2">
                                    <button
                                    onClick={()=>
                                        navigate(`/hospitals/${hospital_id}/wards/${ward.ward_id}/beds`)
                                    }
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                                        View Beds
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