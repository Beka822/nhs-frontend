import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
const ActiveAdmissions=({token})=>{
    const navigate=useNavigate();
    const [hospital_id,setHospitalId]=useState("");
    const [admissions,setAdmissions]=useState([]);
    const [capacity,setCapacity]=useState({
        total:0,
        occupied:0,
        available:0
    });
    useEffect(()=>{
        const hospital_id=localStorage.getItem("hospital_id");
        setHospitalId(hospital_id);
    },[]);
    const fetchAdmissions=async()=>{
        try{
            const res=await api.get(`/admissions/active?hospital_id=${hospital_id}`,{
                headers:{Authorization: `Bearer ${token}`}
            });
            setAdmissions(res.data);
        } catch (err) {
            console.error("Error fetching admissions",err);
        }
    };
    const fetchCapacity=async ()=>{
        try{
            const res=await api.get(`/beds/?hospital_id=${hospital_id}`,{
                headers:{Authorization: `Bearer ${token}`}
            });
            const beds=res.data;
            const total=beds.length;
            const occupied=beds.filter(b=>b.status==="OCCUPIED").length;
            const available=beds.filter(b=>b.status==="AVAILABLE").length;
            setCapacity({total,occupied,available});
        } catch (err) {
            console.error("Error fetching capacity",err);
        }
    };
    useEffect(()=>{
        if (!hospital_id) return;
        fetchAdmissions();
        fetchCapacity();
        const interval=setInterval(()=>{
            fetchAdmissions();
            fetchCapacity();
        },5000);
        return ()=>clearInterval(interval);
    },[hospital_id]);
    const handleDischarge=async(admission_id)=>{
        const confirm=window.confirm("Are you sure you want to discharge this patient?");
        if (!confirm) return;
        try{
            await api.post(`/admissions/${admission_id}/discharge`,{},{
                headers:{Authorization: `Bearer ${token}`}
            });
            fetchAdmissions();
            fetchCapacity();
        } catch (err){
            console.error(err);
            alert("Error discharging patient");
        }
    };
    const handleTransfer=(admission)=>{
        navigate(`/transfer-bed/${admission.admission_id}`);
    };
    return(
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Active Admissions
            </h1>
            {/*Capacity Cards*/}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-100 p-6 rounded-lg shadow">
                    <p className="text-gray-600">Total Beds</p>
                    <h2 className="text-2xl font-bold">{capacity.total}</h2>
                </div>
                <div className="bg-red-100 p-6 rounded-lg shadow">
                    <p className="text-gray-600">Occupied Beds</p>
                    <h2 className="text-2xl font-bold">{capacity.occupied}</h2>
                </div>
                <div className="bg-green-100 p-6 rounded-lg shadow">
                    <p className="text-gray-600">Available Beds</p>
                    <h2 className="text-2xl font-bold">{capacity.available}</h2>
                </div>
            </div>
            {/*Admissions Table*/}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-600">
                            <th className="p-4">Patient</th>
                            <th className="p-4">Bed</th>
                            <th className="p-4">Visit</th>
                            <th className="p-4">Admitted At</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admissions.map((a)=>(
                            <tr key={a.admission_id}
                            className="border-t">
                                <td 
                                className="p-4">{a.patient_id}</td>
                                <td
                                className="p-4">{a.bed_id}</td>
                                <td
                                className="p-4">{a.visit_id}</td>
                                <td
                                className="p-4">{a.admitted_at}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                    onClick={()=>
                                        handleDischarge(a.admission_id)
                                    }
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                                        Discharge
                                    </button>
                                    <button
                                    onClick={()=>
                                        handleTransfer(a)
                                    }
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                        Transfer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ActiveAdmissions;