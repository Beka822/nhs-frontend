import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { FaIdBadge,FaUser,FaCalendar,FaPhone } from "react-icons/fa";
import api from "../api/axios";
const CreatePatient=()=>{
    const navigate=useNavigate();
    const location=useLocation();
    const prefillId=location.state?.patient_id
|| "";
const [formData,setFormData]=useState({
    patient_id:prefillId,
    patient_name:"",
    date_of_birth:"",
    gender:"",
    phone:"",
});
const [error,setError]=useState("");
const [loading,setLoading]=useState(false);
const handleChange=(e)=>{
    setFormData((prev)=>({...prev,[e.target.name]: e.target.value}));
};
const handleSubmit=async (e)=>{
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const token=localStorage.getItem("access_token");
        const res=await api.post("/patients/",
            formData,
            {headers: {Authorization:`Bearer ${token}`, "Content-Type": "application/json"},}
        );
        navigate(`/patients/${res.data.patient_id}`);
    } catch (err) {
        if (err.response) {
            if (err.response.status === 401){
                setError("Session expired. Please login again.");
            } else if (err.response.status === 422) {
                setError("Validation error. Please check your input.");
            } else {
                setError(err.response.data.detail || "Failed to create patient.");
            }
        } else {
            setError("Network error. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};
return(
    <div className="max-w-3xl mx-auto p-6 mt-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Register New Patient
        </h1>
        <div className="bg-white shadow-md rounded-xl p-6">
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                    </div>
            )}
            <form onSubmit={handleSubmit}
            className="space-y-5">
                {/*Patient ID*/}
                <div className="flex items-center gap-3">
                    <FaIdBadge
                    className="text-gray-400 text-xl" />
                    <input
                    type="text"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleChange}
                    placeholder="National ID / UPI"
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!!prefillId}
                    />
                </div>
                {/*Full Name*/}
                <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400 text-xl" />
                    <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                {/*Date of Birth*/}
                <div className="flex items-center gap-3">
                    <FaCalendar className="text-gray-400 text-xl" />
                    <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                {/*Gender*/}
                <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400 text-xl" />
                    <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                {/*Phone*/}
                <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-400 text-xl" />
                    <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                {/*Submit Button*/}
                <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-white font-medium rounded-lg transition-colors ${
                    loading
                    ? "bg-blue-400 cursor-not-allowed"
                    :"bg-blue-600 hover:bg-blue-700"
                }`}
                >
                    {loading ? "Creating Patient..." : "Create Patient"}
                </button>
            </form>
        </div>
    </div>
);
};
export default CreatePatient;