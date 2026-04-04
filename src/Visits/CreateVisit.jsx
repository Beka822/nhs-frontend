import { useState,useEffect,useRef } from "react";
import { useParams,useNavigate } from "react-router-dom";
import api from "../api/axios";
import { TbX } from "react-icons/tb";
const CreateVisit=()=>{
    const {patient_id}=useParams();
    const intervalRef=useRef(null);
    const attemptsRef=useRef(0);
    const stoppedRef=useRef(false);
    const navigate=useNavigate();
    const hospital_id=localStorage.getItem("hospital_id");
    const [showPaymentModal,setShowPaymentModal]=useState(false);
    const [phone,setPhone]=useState("");
    const [isPaying,setIsPaying]=useState(false);
    const [visitId,setVisitId]=useState(null);
    const [checkoutId,setCheckoutId]=useState(null);
    const [error,setError]=useState(null);
    const [paymentStartTime,setPaymentStartTime]=useState(null);
    const [paymentStatus,setPaymentStatus]=useState(null);
    const [visitData,setVisitData]=useState(null);
    const[formData,setFormData]=useState({
        symptoms:"",
        diagnosis:"",
        treatment:"",
        notes:""
    });
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handlePayment = async ()=>{
        if (paymentStatus==="pending") return;
        const reference=visitId
        ? `visit_${visitId}`
        : `visit_${patient_id}_${Date.now()}`;
        const token=localStorage.getItem("token");
        try{
            setPaymentStartTime(new Date().toISOString());
            setPaymentStatus("pending");
            const Res=await api.post("/wallet/topup",{
                phone_number:phone,
                amount:20,
                reference:reference
            },{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }   
            );
            const data=Res.data;
            attemptsRef.current=0;
            stoppedRef.current=false;
            setIsPaying(true);
        } catch (err) {
            console.error("Payment error:",err.response?.data || err);
            setPaymentStatus("failed");
            
        }
    };
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if (!visitId || !isPaying ) return;
        if (intervalRef.current) return;
        intervalRef.current = setInterval(async ()=>{
                if (stoppedRef.current) return;
                attemptsRef.current++;
                if (attemptsRef.current>=20){
                stoppedRef.current=true;
                clearInterval(intervalRef.current);
                intervalRef.current=null;
                setPaymentStatus("failed");
                setIsPaying(false);
                return;
                }
            try{
                const ress=await api.get(`/visits/${patient_id}/${visitId}`,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!ress.data) return;
                const status=ress.data.payment_status || ress.data.visit?.payment_status || ress.data.status;
                if (status==="PAID"){
                    clearInterval(intervalRef.current);
                    intervalRef.current=null;
                    setPaymentStatus("success");
                    setTimeout(()=>{
                    setShowPaymentModal(false);
                    navigate(`/patients/${patient_id}`);
                    },1500);
                    
                }
                if (status==="FAILED"){
                    stoppedRef.current=true;
                    clearInterval(intervalRef.current);
                    intervalRef.current=null;
                    setPaymentStatus("failed");
                    setIsPaying(false);
                    setError("Payment failed. Please try again.");
                    
                }
            } catch (err) {
                console.error("Polling error:",err);
                stoppedRef.current=true;
                clearInterval(intervalRef.current);
                intervalRef.current=null;
                setPaymentStatus("failed");
                setIsPaying(false);
            }
        },3000);
        return () =>{
            if (intervalRef.current){
            clearInterval(intervalRef.current);
            intervalRef.current=null;}}
    },[visitId, isPaying]);
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res=await
            api.post("/visits/",{
                hospital_id:hospital_id,
                patient_id:patient_id,
                symptoms:formData.symptoms,
                diagnosis:formData.diagnosis,
                treatment:formData.treatment,
                notes:formData.notes,
                payment_status:"PENDING"
            },
        {
            headers:{"Content-Type": "application/json"}
        });
        const data=await res.data;
        if (data.status === "PENDING" && data.visit){
            setVisitId(data.visit.visit_id);
            setShowPaymentModal(true);
            return;
        } else if (data.status === "PAYMENT_REQUIRED"){
            setVisitId(null);
            setShowPaymentModal(true);
        }
        } catch (error) {
            console.error(error);
            alert("Failed to create visit");
        }
    };
    const finalizeVisit=async ()=>{
        const token=localStorage.getItem("token");
        await api.post("/visits/",{
            hospital_id:hospital_id,
            patient_id:patient_id,
            symptoms:formData.symptoms,
            diagnosis:formData.diagnosis,
            treatment:formData.treatment,
            notes:formData.notes,
            payment_status:"PAID"
        },{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        setShowPaymentModal(false);
        navigate(`/patients/${patient_id}`);
    };
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Create Patient Visit
            </h1>
            <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-xl p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium">
                        Symptoms
                    </label>
                    <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Diagnosis
                    </label>
                    <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Treatment
                    </label>
                    <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Notes
                    </label>
                    <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    />
                </div>
                {showPaymentModal && (
                    <div className="modal">
                        <h3>Pay KES 20 to create visit</h3>
                        <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e)=>
                            setPhone(e.target.value)
                        } />
                        <button onClick={handlePayment}
                        type="button"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                        disabled={paymentStatus === "pending"}>
                            {paymentStatus === "pending" ? 
                            "Processing...": "Pay Now"}
                        </button>
                        {paymentStatus === "pending" && <p>
                            Check your phone and enter M-Pesa PIN...</p>}
                            {paymentStatus==="success" &&(
                                <p className="text-green-600">Payment successful</p>
                            )}
                            {paymentStatus === "failed" && <p
                            className="text-red-500 text-sm mt-2">Payment failed. Try again</p>}
                            {paymentStatus==="failed" &&(
                                <button
                                type="button"
                                onClick={handlePayment}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200">
                                    Retry Payment
                                </button>
                            )}
                    </div>
                )}
                <button
                onClick={handleSubmit}
                disabled={showPaymentModal}
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Save Visit
                </button>
            </form>
        </div>
    );
};
export default CreateVisit;