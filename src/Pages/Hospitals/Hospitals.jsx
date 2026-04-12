import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
export default function Hospitals({user}) {
    const [hospitals,setHospitals]=useState([])
    const navigate=useNavigate()
    const fetchHospitals=async ()=>{
        try {
            const res=await api.get("/hospitals")
            setHospitals(res.data)
        }catch(err){
            console.error("Error fetching hospitals:",err)
        }
    }
    useEffect(()=>{
        fetchHospitals()
    },[])
    return(
        <div>
            {/*Header*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Hospitals
                </h1>
                {user?.role==="SUPER_ADMIN" && (
                    <button
                    onClick={()=>
                        navigate("/create-hospital")
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Register Hospital
                    </button>
                )}
            </div>
            {/*Hospitals Table*/}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table
                className="w-full">
                    <thead
                    className="bg-gray-100">
                        <tr>
                            <th
                            className="text-left px-6 py-3">Hospital ID</th>
                            <th
                            className="text-left px-6 py-3">Name</th>
                            <th
                            className="text-left px-6 py-3">County</th>
                            <th
                            className="text-left px-6 py-3">Created At</th>
                            <th
                            className="text-left px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospitals.map((hospital)=>(
                            <tr
                            key={hospital.hospital_id}
                            className="border-t">
                                <td
                                className="px-6 py-4">{hospital.hospital_id}</td>
                                <td
                                className="px-6 py-4">{hospital.hospital_name}</td>
                                <td
                                className="px-6 py-4">{hospital.county}</td>
                                <td
                                className="px-6 py-4">{new
                                    Date(hospital.created_at).toLocaleDateString()}</td>
                                    <td
                                    className="px-6 py-4">
                                        <button
                                        onClick={()=>
                                            navigate(`/hospitals/${hospital.hospital_id}`)
                                        }
                                        className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-black"
                                        >
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