import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
const CreateAdmission=({token})=>{
    const {patient_id,visit_id}=useParams();
    const navigate=useNavigate();
    const [hospital_id,setHospitalId]=useState("");
    const [wards,setWards]=useState([]);
    const [selectedWard,setSelectedWard]=useState("");
    const [beds,setBeds]=useState([]);
    const [selectedBed,setSelectedBed]=useState("");
    //Get hospital_id from local storage
    useEffect(()=>{
        const hospital_id=localStorage.getItem("hospital_id");
        if (!hospital_id){
            alert("Hospital ID not found. Please login again.");
            navigate("/login");
            return;
        }
        setHospitalId(hospital_id);
    },[navigate]);
    //Fetch wards for the hospital
    useEffect(()=>{
        if (!hospital_id) return;
        const fetchWards=async ()=>{
            try{
                const res=await api.get(`/wards/?hospital_id=${hospital_id}`,{
                    headers:{Authorization: `Bearer ${token}`},
                });
                setWards(res.data);
            } catch (err) {
                console.error("Error fetching wards:",err);
            }
        }
        fetchWards();
    },[hospital_id,token]);
    //Fetch available beds for selected ward
    useEffect(()=>{
        if(!selectedWard) return;
        const fetchBeds=async ()=>{
            try{
                const res=await api.get(`/beds/?ward_id=${selectedWard}`,{
                    headers:{Authorization: `Bearer ${token}`},
                });

                setBeds(res.data);
                
            }catch (err) {
                console.error("Error fetching beds:",err);
            }
        };
        fetchBeds();
        const interval=setInterval(fetchBeds,5000);
    },[selectedWard,token]);
    //Handle admission submission
    const handleSubmit=async (e)=>{
        e.preventDefault();
        if (!selectedWard || !selectedBed) {
            alert("Please select a ward and an available bed");
            return;
        }
        const selectedBedData=beds.find(b=>
            b.bed_id===selectedBed
        );
        if (!selectedBedData ||
            selectedBedData.status !== "AVAILABLE"
        ) {
            alert("Please select an available bed");
            return;
        }
        try{
            const res=await api.post(`/admissions/${visit_id}`,{
                hospital_id,
                patient_id,
                bed_id:selectedBed,
            },{
                headers:{Authorization: `Bearer ${token}`},
            });
            alert("Patient admitted successfully!");
            navigate(`/visits/:patient_id/:visit_id`);
        } catch (err) {
            console.error("Error creating admission:",err);
            alert(err.response?.data?.detail || "Error creating admission");
        }
    };
    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admit Patient</h2>
        <form onSubmit={handleSubmit}
        className="space-y-5">
            <div>
                <label className="block mb-2 text-gray-700 font-medium">Select Ward</label>
                <select
                value={selectedWard}
                onChange={(e)=>{
                    setSelectedWard(e.target.value);
                    setBeds([]);
                    setSelectedBed("");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Select Ward</option>
                    {wards.map((ward)=>(
                        <option key={ward.ward_id}
                        value={ward.ward_id}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    Select Bed
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {beds.map((bed)=>{
                        const isAvailable=bed.status==="AVAILABLE";
                        const isSelected=selectedBed===bed.bed_id;
                        return(
                            <div
                            key={bed.bed_id}
                            onClick={()=>isAvailable &&
                                setSelectedBed(bed.bed_id)
                            }
                            className={`p-4 rounded-lg text-center cursor-pointer border font-medium transition
                                ${isAvailable ? "bg-green-100 hover:bg-green-200 border-green-400"
                                    :"bg-red-100 border-red-400 cursor-not-allowed"
                                }
                                ${isSelected ? "ring-2 ring-blue-500": ""}`}>
                                    <p
                                    className="font-semibold">{bed.code}</p>
                                    <p className="text-sm">
                                        {bed.status}
                                    </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <button type="submit"
            disabled={!selectedBed}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200">
                Admit Patient
            </button>
        </form>
    </div> 
    );
};
export default CreateAdmission;