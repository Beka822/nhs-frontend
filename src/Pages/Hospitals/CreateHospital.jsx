import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
export default function CreateHospital() {
    const navigate=useNavigate()
    const [hospitalId,setHospitalId]=useState("")
    const [hospitalName,setHospitalName]=useState("")
    const [county,setCounty]=useState("")
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const token=localStorage.getItem("access_token")
        try{
            await api.post("/hospitals",{
                hospital_id:hospitalId,
                hospital_name:hospitalName,
                county:county
            },
        {
          headers:{Authorization:`Bearer ${token}`}  
        })
        navigate("/hospitals")
        } catch (error) {
            console.error(error)
            alert("Failed to create hospital")
        }
    }
    return(
        <div className="bg-white p-6 rounded shadow max-w-lg">
            <h1 className="text-xl font-bold mb-6">
                Register Hospital
            </h1>
            <form onSubmit={handleSubmit}
            className="flex flex-col gap-4">
                <input
                type="text"
                placeholder="Hospital ID"
                value={hospitalId}
                onChange={(e)=>
                    setHospitalId(e.target.value)
                }
                className="border p-2 rounded"
                required
                />
                <input
                type="text"
                placeholder="Hospital Name"
                value={hospitalName}
                onChange={(e)=>
                    setHospitalName(e.target.value)
                }
                className="border p-2 rounded"
                required
                />
                <input
                type="text"
                placeholder="County"
                value={county}
                onChange={(e)=>
                    setCounty(e.target.value)
                }
                className="border p-2 rounded"
                required
                />
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Hospital
                </button>
            </form>
        </div>
    )
}