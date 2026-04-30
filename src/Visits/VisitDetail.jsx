import { useEffect,useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaNotesMedical,FaUserDoctor,FaClock } from "react-icons/fa6";
const VisitDetail=()=>{
    const [symptoms,setSymptoms]=useState("");
    const [diagnosis,setDiagnosis]=useState("");
    const [treatment,setTreatment]=useState("");
    const [notes,setNotes]=useState("");
    const [loading,setLoading]=useState(false);
    const {patient_id,visit_id}=useParams();
    const navigate=useNavigate();
    const [visit,setVisit]=useState(null);
    const [addendums,setAddendums]=useState([]);
    const [files,setFiles]=useState([]);
    const [selectedFile,setSelectedFile]=useState(null);
    const token=localStorage.getItem("token");
    useEffect(()=>{
        const fetchVisit=async ()=>{
            try{ 
        const visitRes=await api.get(`/visits/${patient_id}/${visit_id}`,{
            headers:{Authorization: `Bearer ${token}`}
            });
            setVisit(visitRes.data);
            const patientId=visitRes.data.patient_id;
            //once visit loads, fetch addendum using patient_id + visit_id
            const addendumRes=await api.get(`/visit-addenda/${patient_id}/${visit_id}`);
                setAddendums(addendumRes.data);
            }catch (error){
                console.error(error);
            }
        };
        fetchVisit();
    },[visit_id]);
    useEffect(()=>{
        if (visit){
            setSymptoms(visit.symptoms || "");
            setDiagnosis(visit.diagnosis || "");
            setTreatment(visit.treatment || "");
            setNotes(visit.notes || "");
        }
    },[visit]);
    const handleSave=async ()=>{
        setLoading(true);
        await api.put(`/visits/${visit_id}`,{
            symptoms,
            diagnosis,
            treatment,
            notes
        });
        setLoading(false);
        alert("Visit updated successfully");
        navigate(`/patients/${patient_id}`);
    };
    useEffect(()=>{
        api.get(`/medical-files/patient/${patient_id}`,{
            headers:{Authorization: `Bearer ${token}`}
        })
        .then((res)=>{
            setFiles(res.data);
        })
        .catch((err)=>console.error(err));
    },[patient_id]);
    const uploadFile=async ()=>{
        if (!selectedFile) return;
        const formData=new FormData();
        formData.append("file",selectedFile);
        try{
            await api.post(`/medical-files/upload/${patient_id}`,
                formData,{
                headers: {"Content-Type": "multipart/form-data",},
                }
            );
            alert("File uploaded");
        } catch (error) {
            console.error(error);
            alert("Upload failed")
        }
    };
    const downloadFile=async (file_id,file_name)=>{
        try{
            const response=await api.get(`/medical-files/download/${patient_id}/${file_id}`,
                {
                    responseType: "blob",
                }
            );
            const url=window.URL.createObjectURL(new
                Blob([response.data])
            );
            const link=document.createElement("a");
            link.href=url;
            link.setAttribute("download",file_name);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
            alert("Download failed");
        }
    };
    if (!visit) return <div
    className="p-6">Loading visit...</div>;
    const isLocked=visit?.status==="COMPLETED";
    const handleCreateAdmission=()=>{
        navigate(`/patients/${visit.patient_id}/visits/${visit.visit_id}/admit`,{
            state:{
                hospital_id:visit.hospital_id,
                patient_id:visit.patient_id,
                visit_id:visit.visit_id
            }
        });
    };
    return (
        <div className="p-6 space-y-6">
            {/*VISIT HEADER*/}
            <div className="bg-white shadow rounded-xl p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaNotesMedical
                        className="text-blue-600" />
                        Visit Summary
                    </h1>
                    <button
                    onClick={()=>
                        navigate(`/visits/${patient_id}/${visit_id}/addendum/create`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Add Addendum
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <textarea disabled={isLocked}
                        value={symptoms}
                        onChange={(e)=>
                            setSymptoms(e.target.value)
                        }
                        placeholder="symptoms"
                        className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <textarea disabled={isLocked}
                        value={diagnosis}
                        onChange={(e)=>
                            setDiagnosis(e.target.value)
                        }
                        placeholder="Diagnosis"
                        className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <textarea disabled={isLocked}
                        value={treatment}
                        onChange={(e)=>
                            setTreatment(e.target.value)
                        }
                        placeholder="Treatment"
                        className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <textarea disabled={isLocked}
                        value={notes}
                        onChange={(e)=>
                            setNotes(e.target.value)
                        }
                        placeholder="Notes"
                        className="w-full border p-2 rounded" />
                    </div>
                </div>
                <div className="flex gap-6 text-sm text-gray-500 mt-6">
                    <div className="flex items-center gap-2">
                        <FaUserDoctor />
                        {visit.created_by}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock />
                        {visit.created_at}
                    </div>
                </div>
            </div>
            {/*ADDENDUM SECTION*/}
            <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Visit Addendum
                </h2>
                {addendums.length===0 ? (
                    <p className="text-gray-500">No addendum yet.</p>
                ):(
                    <div className="space-y-4">
                        {addendums.map((a,index)=>(
                            <div
                            key={index}
                            className="border rounded-lg p-4 bg-gray-50">
                                <p
                                className="text-gray-700">{a.comment}</p>
                                <div className="text-xs text-gray-400 mt-2 flex gap-4">
                                    <span>By: {a.created_by}</span>
                                    <span>{a.created_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/*MEDICAL FILES*/}
            <div className="bg-white shadow rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        Medical Files
                    </h2>
                </div>
                {/*Upload*/}
                <div className="flex gap-4 mb-6">
                    <input
                    type="file"
                    onChange={(e)=>
                        setSelectedFile(e.target.files[0])
                    }
                    className="border p-2 rounded"
                    />
                    <button
                    onClick={uploadFile}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Upload File
                    </button>
                </div>
                {/*FILE LIST*/}
                {files.length===0 ? (
                    <p className="text-gray-500">
                        No medical files uploaded.
                    </p>
                ):(
                    <div className="space-y-3">
                        {files.map((file)=>(
                            <div
                            key={file.file_id}
                            className="flex justify-between items-center border rounded p-3">
                                <span className="text-gray-700">
                                    {file.file_name}
                                </span>
                                <button
                                onClick={()=>
                                    downloadFile(file.file_id,file.file_name)
                                }
                                className="text-blue-600 hover:underline">
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
            onClick={handleCreateAdmission}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Admit Patient
            </button>
            <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded">
                {loading ? "Saving...": "Save Consultation"}
            </button>
            <p className="text-gray-500">
                Visit completed. Use addendum for changes.
            </p>
        </div>
    );
};
export default VisitDetail;