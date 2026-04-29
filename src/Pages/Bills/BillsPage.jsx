import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
const BillsPage=({token})=>{
    const [bills,setBills]=useState([]);
    const [showModal,setShowModal]=useState(false);
    const [visitId,setVisitId]=useState("");
    const [period,setPeriod]=useState("today")
    const [admissionId,setAdmissionId]=useState("");
    const navigate=useNavigate();
    const hospital_id=localStorage.getItem("hospital_id");
    const getDateRange=()=>{
        const now= new Date();
        if (period==="today") {
            const start=new Date();
            start.setHours(0,0,0,0);
            return {start,end: new Date()};
        }
        if (period==="week") {
            const start=new Date();
            start.setDate(start.getDate() - start.getDay());
            return {start,end: new Date()};
        }
        if (period==="month") {
            return {
                start: new Date(now.getFullYear(),now.getMonth(),1),
                end: new Date()
            };
        }
        if (period==="year"){
            return {
                start: new Date(now.getFullYear(),0,1),
                end: new Date()
            };
        }
    };
    const fetchBills=async()=>{
        const {start,end}=getDateRange();
        try{
            const res=await api.get(`/bills/bills`,{
                params:{
                    start_date:start.toISOString(),
                    end_date:end.toISOString()
                },
                headers:{Authorization: `Bearer ${token}`}
            });
            setBills(res.data);
        } catch (err) {
            console.error("Error fetching bills",err);
        }
    };
    useEffect(()=>{
        fetchBills();
    },[period]);
    /*Billing Dashboard Calculation*/
    const totalBills=bills.length;
    const paidBills=bills.filter(
        (b)=>b.total_amount===b.amount_paid
    ).length;
    const unpaidBills=bills.filter(
        (b)=>b.total_amount>b.amount_paid
    ).length;
    const revenue=bills.reduce(
        (sum,b)=>sum+b.amount_paid,0
    );
    /*Create Bill*/
    const handleCreateBill=async(e)=>{
        e.preventDefault();
        if (!visitId){
            alert("Visit ID is required");
            return;
        }
        try{
            await api.post(`/bills/bills?visit_id=${visitId}`,{
                hospital_id:hospital_id,
                admission_id:admissionId || null
            },{
                headers:{Authorization: `Bearer ${token}`}
            });
            alert("Bill created successfully");
            setShowModal(false);
            setVisitId("");
            setAdmissionId("");
            fetchBills();
        } catch (err) {
            console.error(err);
            alert("Failed to create bill");
        }
    };
    const handleAddService=()=>{
        if (!hospital_id){
            alert("Hospital ID missing");
            return;
        }
        navigate(`/hospitals/${hospital_id}/services`);
    };
    return(
        <div className="p-6 space-y-6">
            <div className="flex justify-end mb-4">
                <button
                onClick={handleAddService}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    + Add Service
                </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
                Billing Dashboard
            </h1>
            <select
            value={period}
            onChange={(e)=>
                setPeriod(e.target.value)
            }
            className="border px-3 py-2 rounded">
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
            </select>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Bills</p>
                    <p className="text-2xl font-bold">{totalBills}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Paid Bills</p>
                    <p className="text-2xl font-bold text-green-600">
                        {paidBills}
                    </p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Unpaid Bills</p>
                    <p className="text-2xl font-bold text-red-600">{unpaidBills}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">
                        KES {revenue}
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-4">
                    <button
                    onClick={()=>setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        + Create Bill
                    </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Bills Table
                </h2>
                <div className="bg-white shadow rounded-lg w-full">
                    <table className="w-full text-sm text-left table-auto">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-4 text-left">Patient Name</th>
                                <th className="p-4 text-left">Total</th>
                                <th className="p-4 text-left">Paid</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Created</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill)=>{
                                const balance=bill.total_amount - bill.amount_paid;
                                return(
                                    <tr key={bill.bill_id}
                                    className="border-t hover:bg-gray-50">
                                        <td className="p-3">
                                            {bill.patient_name}
                                        </td>
                                        <td className="p-3">
                                            KES {bill.total_amount}
                                        </td>
                                        <td className="p-3 text-green-600">
                                            KES {bill.amount_paid}
                                        </td>
                                        <td className="p-3">
                                            {balance <= 0 ? (
                                                <span
                                                className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                                    PAID
                                                </span>
                                            ):(
                                                <span
                                                className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                                    PENDING
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {new Date(bill.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            <button
                                            onClick={()=>navigate(`/bills/${bill.bill_id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Create Bill
                            </h2>
                            <form
                            onSubmit={handleCreateBill}
                            className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1">
                                        Visit ID
                                    </label>
                                    <input
                                    type="text"
                                    value={visitId}
                                    onChange={(e)=>
                                        setVisitId(e.target.value)
                                    }
                                    required
                                    className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm nb-1">
                                        Admission ID (optional)
                                    </label>
                                    <input
                                    type="text"
                                    value={admissionId}
                                    onChange={(e)=>
                                        setAdmissionId(e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                    type="button"
                                    onClick={()=>
                                        setShowModal(false)
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded">
                                        Cancel
                                    </button>
                                    <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded">
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default BillsPage;