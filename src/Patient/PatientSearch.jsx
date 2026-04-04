import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
function PatientSearch() {
    const [patientId,setPatientId]=useState("")
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate()
    const handleSearch=async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            const res=await api.get(`/patients/${patientId}`)
            navigate(`/patients/${patientId}`,
                {state:res.data}
            )
        } catch (err) {
            if (err.response){
                if (err.response.status === 404){
                    navigate("/patients/register",
                        {state: {patient_id:patientId}}
                    );
                } else if (err.response.status === 401 || err.response.status === 403) {
                    navigate("/login");
                } else {
                    setError(err.response.data.detail || "An error occurred.");
                }
            } else {
                setError("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Search Patient
                </h2>
                <input
                type="text"
                placeholder="Enter National ID or UPI"
                value={patientId}
                onChange={(e)=>
                    setPatientId(e.target.value)
                }
                className="w-full border p-3 rounded-lg mb-4"
                />
                <button
                onClick={handleSearch}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                    Search
                </button>
                {error && (
                    <p className="text-red-500 mt-4 text-center">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}
export default PatientSearch