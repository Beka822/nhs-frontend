import { useEffect,useState } from "react";
import { useParams,Link,useNavigate } from "react-router-dom";
import { FaUserInjured,FaPhone,FaCalendar,FaIdBadge,FaUser,FaFileMedical,FaNotesMedical } from "react-icons/fa6";
import api from "../api/axios";
const PatientDetail=()=>{
    const {patient_id}=useParams();
    const navigate=useNavigate();
    const [patient,setPatient]=useState(null);
    const [visits,setVisits]=useState([]);
    const [files,setFiles]=useState([]);
    const [activeTab,setActiveTab]=useState("visits");
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    //Fetch Patient
    useEffect(()=>{
        api.get(`/patients/${patient_id}`)
        .then((res)=>{
            setPatient(res.data);
            setLoading(false);
        })
        .catch(()=>{
            setError("Patient not found.");
            setLoading(false);
        });
    },[patient_id]);
    //Fetch visits
    useEffect(()=>{
        if (!patient) return;
        api.get(`/visits/${patient_id}`)
        .then((res)=>setVisits(res.data))
        .catch(()=>setVisits([]));
    },[patient]);
    //Fetch files
    useEffect(()=>{
        if (!patient) return;
        api.get(`medical-files/patient/${patient_id}`)
        .then((res)=>setFiles(res.data))
        .catch(()=>setFiles([]));
    },[patient]);
    if (loading) return <div className="p-10">Loading...</div>;
    if(error){
        return(
            <div className="p-10 text-center">
                <h2 className="text-xl font-semibold text-red-600">
                    {error}
                </h2>
                <Link
                to="/patients/register"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
                    Register Patient
                </Link>
            </div>
        );
    }
    if(!patient){
        return <div className="p-10">Loading...</div>;
    }
    return(
        <div className="p-6 space-y-6">
            {/*PATIENT HEADER*/}
            <div className="bg-white shadow rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <FaUserInjured
                        className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{patient.patient_name}</h1>
                        <p className="text-gray-500">{patient.patient_id}</p>
                    </div>
                </div>
                {/*PATIENT INFO GRID*/}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-sm">
                    <div className="flex items-center gap-2">
                        <FaCalendar
                        className="text-gray-400" />
                        <div>
                            <p className="text-gray-500">Date of Birth</p>
                            <p className="font-medium">{patient.date_of_birth}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <div>
                            <p className="text-gray-500">Gender</p>
                            <p className="font-medium">{patient.gender}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium">{patient.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaIdBadge className="text-gray-400" />
                        <div>
                            <p className="text-gray-500">Created By</p>
                            <p className="font-medium">{patient.created_by}</p>

                        </div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                    Created at:{patient.created_at}
                </div>
            </div>
            {/*TABS*/}
            <div className="bg-white shadow rounded-xl">
                <div className="flex border-b">
                    <button
                    onClick={()=>
                        setActiveTab("visits")
                    }
                    className={`px-6 py-3 flex items-center gap-2 ${activeTab==="visits"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        :"text-gray-500"
                    }`}
                    >
                        <FaNotesMedical />
                        Visits
                    </button>
                    <button
                    onClick={()=>
                        setActiveTab("files")
                    }
                    className={`px-6 py-3 flex items-center gap-2 ${activeTab==="files"
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        :"text-gray-500"
                    }`}
                    >
                        <FaFileMedical />
                        Medical Files
                    </button>
                </div>
                {/*VISIT TAB */}
                <div className="p-6">
                    {activeTab==="visits" &&(
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Patient Visits</h2>
                                <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                onClick={()=>
                                    navigate(`/patients/${patient_id}/visits/create`)
                                }
                                >
                                    + Create Visit
                                </button>
                            </div>
                            {visits.length===0 ?(
                                <p
                                className="text-gray-500">No visits recorded yet</p>
                            ):(
                                <div className="space-y-4">
                                    {visits.map((visit)=>(
                                        <div
                                        key={visit.visit_id}
                                        className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-md transition"
                                        >
                                            <div>
                                                <p
                                                className="font-medium">Visit ID:{visit.visit_id}</p>
                                                <p
                                                className="text-gray-500 text-sm">
                                                    Symptoms:
                                                    {visit.symptoms} | Diagnosis:
                                                    {visit.diagnosis}
                                                </p>
                                                <p
                                                className="text-gray-500 text-sm">
                                                    Treatment:
                                                    {visit.treatment} | Notes:{visit.notes}
                                                </p>
                                                <p
                                                className="text-gray-400 text-xs">
                                                    Created at:
                                                    {visit.created_at} | By:{visit.created_by}
                                                </p>
                                            </div>
                                                <button
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={()=>
                                                    navigate(`/visits/${patient_id}/${visit.visit_id}`)
                                                }
                                                >
                                                    View visit
                                                </button>
                                                </div>
                                    ))}
                                    </div>
                            )}
                            </div>

                    )}
                    {/*MEDICAL FILES TAB*/}
                    {activeTab==="files" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Medical Files</h2>
                                <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                onClick={()=>
                                    navigate(`/patients/${patient_id}/files/upload`)
                                }
                                >
                                    + Upload File
                                </button>
                            </div>
                            {files.length===0 ? (
                                <p
                                className="text-gray-500">No medical files uploaded yet.</p>
                            ):(
                                <div className="space-y-2">
                                    {files.map((file)=>(
                                        <div
                                        key={file.file_id}
                                        className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-md transition"
                                        >
                                            <div>
                                                <p
                                                className="font-medium">{file.file_name}</p>
                                                <p
                                                className="text-gray-500 text-sm">{file.created_at}</p>
                                                </div>
                                                <button
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={()=>
                                                    window.open(`${api.defaults.baseURL}/medical-file/download/${patient_id}/${file.file_id}`,"_blank")
                                                }
                                                >
                                                    View File
                                                </button>
                                                </div>
                                    ))}
                                    </div>
                            )}
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PatientDetail;