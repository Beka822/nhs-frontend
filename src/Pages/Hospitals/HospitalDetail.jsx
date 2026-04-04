import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaBed,FaFileInvoiceDollar, FaUserGroup,FaUserInjured } from "react-icons/fa6";
export default function HospitalDetail({user}) {
    const {hospital_id}=useParams()
    const navigate=useNavigate()
    const [hospital,setHospital]=useState(null)
    const fetchHospital=async ()=>{
        try {
            const res=await api.get(`/hospitals/${hospital_id}`)
            setHospital(res.data)
        } catch (err) {
            console.error("Error fetching hospital:",err)
        }
    }
    useEffect(()=>{
        fetchHospital()
    },[])
    if (!hospital) {
        return <div
        className="text-gray-600">Loading hospital...</div>
    }
    return (
        <div>
            {/*Hospital Header*/}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{hospital.hospital_name}</h1>
                <p
                className="text-gray-600">Hospital ID:{hospital.hospital_id}</p>
                <p
                className="text-gray-600">County:{hospital.county}</p>
                <p
                className="text-gray-600">Created At:{new
                    Date(hospital.created_at).toLocaleDateString()}</p>
            </div>
            {/*Management Section*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/*Users*/}
                <div
                onClick={()=>
                    navigate(`/hospitals/${hospital.hospital_id}/users`)
                }
                className="bg-white shadow rounded-lg p-6  hover:shadow-lg cursor-pointer transition flex flex-col items-center justify-center">
                    <FaUserGroup className="w-12 h-12 text-gray-700 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Manage Users
                    </h2>
                    <p
                    className="text-gray-600 mt-2">
                        Doctors,Nurses,Staff,Admins
                    </p>
                </div>
                {/*Wards*/}
                <div
                onClick={()=>
                    navigate(`/hospitals/${hospital.hospital_id}/wards`)
                }
                className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg">
                    <FaBed className="w-12 h-12 text-gray-700 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Wards
                    </h2>
                    <p
                    className="text-gray-600 mt-2">
                        Manage hospital wards
                    </p>
                </div>
                {/*patients*/}
                <div
                onClick={()=>
                    navigate(`/patients/search`)
                }
                className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg">
                    <FaUserInjured className="w-12 h-12 text-gray-700 mb-4"/>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Patients
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Get patient's details
                    </p>
                </div>
                {/*Active Admissions*/}
                <div onClick={()=>navigate("/active-admissions")}
                className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg">
                    <FaBed className="w-12 h-12 text-gray-700 mb-4" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Active Admissions
                    </h2>
                </div>
                {/*Bills*/}
                <div
                onClick={()=>navigate(`/hospital/${hospital_id}/bills`)}
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition border">
                    <div className="flex items-center space-x-4">
                        <div className="text-green-600 text-3xl">
                            <FaFileInvoiceDollar />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Bills & Payments
                    </h3>
                    <p className="text-sm text-gray-500">
                        Manage hospital billing
                    </p>
                </div>
            </div>
            </div>
    )
}