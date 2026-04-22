import {useEffect,useState} from "react";
import api from "../api/axios";
export default function HospitalRevenueCard(){
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        fetchRevenue();
    },[]);
    const fetchRevenue=async () =>{
        try{
            const token=localStorage.getItem("token")
            const res=await api.get("/pay/payout",{
                headers:{Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error("Error fetching revenue",err);
            console.log(err.response?.data)
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
        );
    }
    return(
        <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
            {/*Header */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {data?.hospital_name || "Hospital"}
                    </h2>
                    <p className="text-sm text-blue-600 font-medium">
                        {data?.month ? `${data.month} Summary`: "Summary"} 
                    </p>
            </div>
                    <div className="border-t border-gray-200 mb-4"></div>
                    {/*Total Visits*/}
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Total Visits</span>
                        <span className="font-semibold text-gray-800">
                            {data?.total_visits ?? 0}
                        </span>
                    </div>
                    {/*Total Revenue*/}
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Total Revenue</span>
                        <span className="font-bold text-gray-900">
                            KES{(data?.total_revenue ?? 0).toLocaleString()}
                        </span>
                    </div>
                    {/*Clinic Earnings*/}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Clinic Earnings</span>
                        <span className="font-bold text-green-600">
                            KES
                            {(data?.clinic_earnings ?? 0).toLocaleString()}
                        </span>
                    </div>
         </div>
                        
                        
    );
}