import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
const BillDetail=({token})=>{
    const {bill_id}=useParams();
    const [bill,setBill]=useState(null);
    const [items,setItems]=useState([]);
    const [payments,setPayments]=useState([]);
    const [showItemModal,setShowItemModal]=useState(false);
    const [showPaymentModal,setShowPaymentModal]=useState(false);
    const [description,setDescription]=useState("");
    const [quantity,setQuantity]=useState(1);
    const [unitPrice,setUnitPrice]=useState("");
    const [amount,setAmount]=useState("");
    const [method,setMethod]=useState("");
    const [reference,setReference]=useState("");
    /*FETCH DATA */
    const fetchBill=async ()=>{
        const res=await api.get(`/bills/${bill_id}`,{
            headers: {Authorization: `Bearer ${token}`}
        });
        setBill(res.data);
    };
    const fetchItems=async ()=>{
        const res=await api.get(`/bills/${bill_id}/items`,{
            headers:{Authorization: `Bearer ${token}`}
        });
        setItems(res.data);
    };
    const fetchPayments=async()=>{
        const res=await api.get(`/payments/?bill_id=${bill_id}`,{
            headers:{Authorization: `Bearer ${token}`}
        });
        setPayments(res.data);
    };
    useEffect(()=>{
        fetchBill();
        fetchItems();
        fetchPayments();
    },[]);
    /*ADD ITEM*/
    const handleAddItem=async (e)=>{
        e.preventDefault();
        await api.post(`/bills/${bill_id}/items`,{
            description,
            quantity,
            unit_price:unitPrice
        },{
            headers:{Authorization: `Bearer ${token}`}
        });
        setShowItemModal(false);
        setDescription("");
        setQuantity(1);
        setUnitPrice("");
        fetchItems();
        fetchBill();
    };
    /*MAKE PAYMENT*/
    const handlePayment=async (e)=>{
        e.preventDefault();
        await api.post(`/payments/bill/${bill_id}/payments`,{
            bill_id,
            amount,
            payment_method:method,
            reference_number:reference
        },{
            headers:{Authorization: `Bearer ${token}`}
        });
        setShowPaymentModal(false);
        setAmount("");
        setMethod("");
        setReference("");
        fetchPayments();
        fetchBill();
    };
    if (!bill) return <p>Loading...</p>;
    const balance =bill.total_amount - bill.amount_paid;
    return(
        <div className="p-6 space-y-6">
            <div className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-gray-500 text-sm">Patient</p>
                    <p
                    className="font-semibold">{bill.patient_name}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Total</p>
                    <p
                    className="font-bold">KES
                    {bill.total_amount}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Paid</p>
                    <p
                    className="text-green-600 font-bold">
                        KES {bill.amount_paid}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Balance</p>
                    <p className="text-red-600 font-bold">
                        KES {balance}
                    </p>
                </div>
            </div>
            {/*BILL ITEM*/}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-semibold">Bill Items</h2>
                    <button
                    onClick={()=>
                        setShowItemModal(true)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                        + Add Item
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-left">Qty</th>
                            <th className="p-2 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item)=>(
                            <tr key={item.item_id} className="border-t">
                                <td className="p-2">{item.description}</td>
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2">KES
                                    {item.unit_price}</td>
                                    <td className="p-2">KES
                                        {item.total_price}
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/*PAYMENTS*/}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-semibold">Payments</h2>
                    <button
                    onClick={()=>
                        setShowPaymentModal(true)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded">
                        + Pay
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Method</th>
                            <th className="p-2">Reference</th>
                            <th className="p-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p)=>(
                            <tr key={p.payment_id}
                            className="border-t">
                                <td className="p-2">KES
                                    {p.amount}
                                </td>
                                <td className="p-2">{p.payment_method}</td>
                                <td className="p-2">{p.reference_number}</td>
                                <td className="p-2">{new
                                Date(p.received_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* MODALS*/}
            {/*Add Item Modal*/}
            {showItemModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <form onSubmit={handleAddItem}
                    className="bg-white p-6 rounded space-y-3">
                        <h2>Add Item</h2>
                        <input placeholder="Description"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        className="border p-2 w-full" />
                        <input type="number"
                        value={quantity}
                        onChange={(e)=>setQuantity(e.target.value)}
                        className="border p-2 w-full" />
                        <input type="number"
                        placeholder="Unit Price"
                        value={unitPrice}
                        onChange={(e)=>setUnitPrice(e.target.value)}
                        className="border p-2 w-full" />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">
                            Add
                        </button>
                    </form>
                </div>
            )}
            {/*Payment Modal*/}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <form onSubmit={handlePayment}
                    className="bg-white p-6 rounded space-y-3">
                        <h2>Make Payment</h2>
                        <input type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e)=>setAmount(e.target.value)}
                        className="border p-2 w-full" />
                        <input placeholder="Method"
                        value={method}
                        onChange={(e)=>setMethod(e.target.value)}
                        className="border p-2 w-full" />
                        <input placeholder="Reference"
                        value={reference}
                        onChange={(e)=>setReference(e.target.value)}
                        className="border p-2 w-full" />
                        <button
                        className="bg-green-600 text-white px-4 py-2 rounded">
                            Pay
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
export default BillDetail;