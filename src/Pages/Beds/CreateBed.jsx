import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";
export default function CreateBed() {
    const {ward_id,hospital_id}=useParams()
    const navigate=useNavigate()
    const [code,setCode]=useState ("")
    const [isIcu,setIsIcu]=useState(false)
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const token=localStorage.getItem("access_token")
        try{
            await api.post("/beds",{
                ward_id:ward_id,
                code:code,
                is_icu:isIcu
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            alert("Bed created successfully")
            navigate(`/hospitals/${hospital_id}/wards/${ward_id}/beds`)
        } catch(error) {
            console.error(error)
            alert("Failed to create bed")
        }
    }
    return(
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-6">
                Create Bed
            </h1>
            <form onSubmit={handleSubmit}
            className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm mb-1">Ward ID</label>
                    <input
                    type="text"
                    value={ward_id}
                    disabled
                    className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Bed Code</label>
                    <input
                    type="text"
                    value={code}
                    onChange={(e)=>
                        setCode(e.target.value)
                    }
                    placeholder="BED-01"
                    className="border p-2 rounded w-full"
                    required
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={isIcu}
                    onChange={(e)=>
                        setIsIcu(e.target.checked)
                    } />
                    <label>ICU Bed</label>
                </div>
                <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Create Bed
                </button>
            </form>
        </div>
    )
}