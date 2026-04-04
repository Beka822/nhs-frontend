import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
const TransferBed=({token})=>{
    const {admission_id}=useParams();
    const navigate=useNavigate();
    const [hospital_id,setHospitalId]=useState("");
    const [wards,setWards]=useState([]);
    const [beds,setBeds]=useState([]);
    const [selectedWard,setSelectedWard]=useState("");
    const [selectedBed,setSelectedBed]=useState("");
    const [reason,setReason]=useState("");
    const [admission,setAdmission]=useState(null);
    //Get hospital_id
    useEffect(()=>{
        const hospital_id=localStorage.getItem("hospital_id");
        setHospitalId(hospital_id);
    },[]);
    //Fetch admission details
    useEffect(()=>{
        const fetchAdmission=async ()=>{
            try{
                const res=await api.get(`/admissions/${admission_id}`,{
                    headers:{Authorization: `Bearer ${token}`}
                });
                setAdmission(res.data);
            } catch (err) {
                console.error("Error fetching admission:",err);
            }
        };
        fetchAdmission();
    },[admission_id,token]);
    //Fetch wards
    useEffect(()=>{
        if (!hospital_id) return;
        const fetchWards=async()=>{
            try{
                const res=await api.get(`/wards/?hospital_id=${hospital_id}`,{
                    headers:{Authorization: `Bearer ${token}`}
                });
                setWards(res.data);
            } catch(err) {
                console.error("Error fetching wards:",err);
            }
        };
        fetchWards();
    },[hospital_id,token])
    //Fetch available beds
    const fetchBeds=async ()=>{
        if (!selectedWard) return;
        try{
            const res=await api.get(`/beds/?ward_id=${selectedWard}`,{
                headers:{Authorization: `Bearer ${token}`}
            });
            const availableBeds=res.data.filter((bed)=>bed.status==="AVAILABLE");
            setBeds(availableBeds);
        } catch (err) {
            console.error("Error fetching beds",err);
        }
    };
    useEffect(()=>{
        fetchBeds();
        const interval=setInterval(fetchBeds,5000);
        return ()=>clearInterval(interval);
    },[selectedWard]);
    //Transfer request
    const handleTransfer=async (e)=>{
        e.preventDefault();
        if (!selectedBed) {
            alert("Select a bed");
            return;
        }
        try{
            await api.post(`/transfers/${admission_id}/transfer`,{
                new_bed_id:selectedBed,
                reason:reason
            },{
                headers:{Authorization: `Bearer ${token}`}
            });
            alert("Bed transfered successfully");
            navigate("/active-admissions");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Transfer failed");
        }
    };
    if (!admission) {
        return <div className="p-10">Loading admission...</div>;
    }
    return(
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Transfer Bed
            </h2>
            {/*Current Admission Info*/}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">
                    Current Admission Info
                </h3>
                <p>
                    <span className="font-medium">Patient:</span>
                    {admission.patient_id}
                </p>
                <p>
                    <span className="font-medium">Current Bed:</span>
                    {admission.bed_id}
                </p>
                <p>
                    <span className="font-medium">Visit:</span>
                    {admission.visit_id}
                </p>
            </div>
            <form onSubmit={handleTransfer}
            className="space-y-5">
                {/*Ward Select*/}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Select Ward
                    </label>
                    <select
                    value={selectedWard}
                    onChange={(e)=>{
                        setSelectedWard(e.target.value);
                        setBeds([]);
                        setSelectedBed("");
                    }}
                    className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Ward</option>
                        {wards.map((w)=>(
                            <option key={w.ward_id}
                            value={w.ward_id}>{w.name}</option>
                        ))}
                    </select>
                </div>
                {/*Bed select*/}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">
                        Select Available Bed
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {beds.map((bed)=>{
                            const isAvailable=bed.status === "AVAILABLE";
                            const isSelected = selectedBed ===bed.bed_id;
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
                {/*Reason*/}
                <div>
                    <label className="block mb-2 text-gray-700 font-medium">
                        Reason for Transfer
                    </label>
                    <textarea
                    value={reason}
                    onChange={(e)=>
                        setReason(e.target.value)
                    }
                    placeholder="e.g. ICU escalation,isolation,ward change"
                    className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"/>
                </div>
                {/*Buttons*/}
                <div className="flex justify-between pt-4">
                    <button
                    type="button"
                    onClick={()=>navigate("/active-admissions")}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                        Cancel
                    </button>
                    <button 
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        Transfer Bed
                    </button>
                </div>
            </form>
        </div>
    );
};
export default TransferBed;