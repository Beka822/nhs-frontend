import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaNotesMedical } from "react-icons/fa6";
const CreateVisitAddendum=()=>{
    const {patient_id,visit_id}=useParams();
    const navigate=useNavigate();
    const [comment,setComment]=useState("");
    const [loading,setLoading]=useState(false);
    const handleSubmit=async (e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            await api.post("/visit-addenda/",{
                patient_id:patient_id,
                visit_id:visit_id,
                comment:comment
            });
            navigate(`/visits/${patient_id}/${visit_id}`);
        } catch(error) {
            console.error(error);
            alert("Failed to create addendum");
        }
        setLoading(false);
    };
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-white shadow rounded-xl p-6">
                <h1 className="text-xl font-semibold flex items-center gap-2 mb-6">
                    <FaNotesMedical
                    className="text-blue-600" />
                    Add Visit Addendum
                </h1>
                <form onSubmit={handleSubmit}
                className="space-y-6">
                    {/*COMMENT*/}
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">
                            Clinical Comment
                        </label>
                        <textarea
                        required
                        rows="5"
                        value={comment}
                        onChange={(e)=>
                            setComment(e.target.value)
                        }
                        placeholder="Enter clinical update or clarification..."
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    {/*BUTTONS*/}
                    <div className="flex justify-between">
                        <button
                        type="button"
                        onClick={()=>navigate(-1)}
                        className="px-4 py-2 border rounded-lg">
                            Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            {loading ? "Saving...": "Save Addendum"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreateVisitAddendum;