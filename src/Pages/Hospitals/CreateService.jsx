import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios";
export default function CreateService(){
    const navigate=useNavigate();
    const hospital_id=localStorage.getItem("hospital_id");
    const [name,setName]=useState("");
    const [price,setPrice]=useState("");
    const handleSubmit=async ()=>{
        await api.post("/service/",{
            name,
            price:parseFloat(price)
        });
        setName("");
        setPrice("");
        alert("Service added");
        navigate(`/hospital/${hospital_id}/bills`,{
            replace:true
        });
    };
    return(
        <div className="space-y-3">
            <input
            type="text"
            placeholder="Service name (e.g. X-ray)"
            value={name}
            onChange={(e)=>
                setName(e.target.value)
            }
            className="w-full border p-2 rounded" />
            <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e)=>
                setPrice(e.target.value)
            }
            className="w-full border p-2 rounded" />
            <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded">
                Add Service
            </button>
        </div>
    );
}