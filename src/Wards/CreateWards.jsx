import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../api/axios";
function CreateWards() {
    const {hospital_id}=useParams();
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        code:"",
        name:"",
        ward_type:"",
        capacity:"",
        floor:""
    });
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try {
            await api.post(`/wards`,{
                ...formData,
                hospital_id:hospital_id
            });
            alert("Ward created successfuly");
            navigate(`/hospitals/${hospital_id}/wards`);
        } catch(error) {
            console.error(error);
            alert("Failed to create ward");
        }
    };
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Ward</h2>
                <form onSubmit={handleSubmit}
                className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Ward Code</label>
                        <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="ICU-01"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Ward Name</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Intensive Care Unit"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Ward Type</label>
                        <select
                        name="ward_type"
                        value={formData.ward_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        >
                            <option value="">Select Ward Type</option>
                            <option value="ICU">ICU</option>
                            <option value="Maternity">Maternity</option>
                            <option value="General">General</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Surgical">Surgical</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Capacity</label>
                        <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="10"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Floor</label>
                        <input
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        placeholder="Ground"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        />
                    </div>
                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        Create Ward
                    </button>
                </form>
            </div>
        </div>
    );
}
export default CreateWards;