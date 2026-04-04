import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";
export default function Beds() {
    const {hospital_id,ward_id}=useParams()
    const navigate=useNavigate()
    const [beds,setBeds]=useState([])
    useEffect(()=>{
        fetchBeds()
    },[])
    const fetchBeds=async ()=>{
        const token=localStorage.getItem("access_token")
        try{
            const response=await api.get(`/beds?ward_id=${ward_id}`,{
                headers:{Authorization:`Bearer ${token}`}
            })
            setBeds(response.data)
        } catch(error) {
            console.error("Error loading beds",error)
        }
    }
    return(
        <div>
            {/*Header*/}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">
                    Ward Beds
                </h1>
                <button
                onClick={()=>navigate(`/hospitals/${hospital_id}/wards/${ward_id}/beds/create`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Bed
                </button>
            </div>
            {/*TABLE*/}
            <div className="bg-white shadow rounded">
                <table className="w-full">
                    <thead className="border-b bg-gray-50">
                        <tr className="text-left">
                            <th className="p-3">Bed ID</th>
                            <th className="p-3">Code</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">ICU</th>
                            <th className="p-3">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beds.map((bed)=>(
                            <tr
                            key={bed.bed_id}
                            className="border-b hover:bg-gray-50">
                                <td
                                className="p-3">{bed.bed_id}</td>
                                <td
                                className="p-3">{bed.code}</td>
                                <td
                                className="p-3">{bed.status}</td>
                                <td
                                className="p-3">{bed.is_icu ? "True":"False"}</td>
                                <td
                                className="p-3">{new
                                    Date(bed.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}