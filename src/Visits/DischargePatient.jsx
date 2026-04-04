import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
const DischargePatient=({token})=>{
    const {admission_id}=useParams();
    const navigate=useNavigate();
    const [admission,setAdmission]=useState(null);
    const [loading,setLoading]=useState(true);
    //Fetch admission details
    useEffect(()=>{
        const fetchAdmission=async ()=>{
            try{
                const res=await api.get(`/admissions/${admission_id}`,{
                    headers: {Authorization: `Bearer ${token}`},
                });
                setAdmission(res.data);
                setLoading(false);
            }catch (err) {
                console.error("Error fetching admission:",err);
                setLoading(false);
            } 
        };
        fetchAdmission();
    },[admission_id,token]);
    const handleDischarge=async()=>{
        try{
            await api.post(`/admissions/${admission_id}/discharge`,{},{
                headers:{Authorization: `Bearer ${token}`},
            });
            alert("Patient discharged successfully");
            navigate(`/patients/${admission.patient_id}/visits/${admission.visit_id}`);
        } catch(err) {
            console.error("Error discharging patient:",err);
            alert(err.response?.data?.detail || "Error discharging patient");
        }
    };
    if (loading) {
        return (
            <div className="text-center mt-10 text-gray-600">
                Loading admission details...
            </div>
        );
    }
    if (!admission){
        return(
            <div className="text-center mt-10 text-red-500">
                Admission not found
            </div>
        );
    }
    return(
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Discharge Patient
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="text-gray-600 font-medium">Patient ID</label>
                    <p className="bg-gray-100 p-2 rounded">{admission.patient_id}</p>
                </div>
                <div>
                    <label className="text-gray-600 font-medium">Bed ID</label>
                    <p className="bg-gray-100 p-2 rounded">{admission.bed_id}</p>
                </div>
                <div>
                    <label className="text-gray-600 font-medium">Admitted At</label>
                    <p className="bg-gray-100 p-2 rounded">{admission.admitted_at}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-between">
                <button
                onClick={()=>navigate(-1)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Cancel
                </button>
                <button
                onClick={handleDischarge}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Discharge Patient
                </button>
            </div>
        </div>
    );
};
export default DischargePatient;