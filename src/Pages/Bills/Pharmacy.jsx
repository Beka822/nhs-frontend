import { useEffect,useState } from "react";
import api from "../../api/axios";
import { Input } from "postcss";
export default function Pharmacy(){
    const [drugs,setDrugs]=useState([]);
    const [showAddModal,setShowAddModal]=useState(false);
    const [showEditModal,setShowEditModal]=useState(false);
    const [showDispenseModal,setShowDispenseModal]=useState(false);
    const [selectedDrug,setSelectedDrug]=useState(null);
    const [formData,setFormData]=useState({
        name:"",
        category:"",
        unit:"",
        buying_price:"",
        selling_price:"",
        quantity_in_stock:"",
        reorder_level:""
    });
    const [dispenseData,setDispenseData]=useState({
        quantity:"",
        payment_method:"cash"
    });
    useEffect(()=>{
        fetchDrugs();
    },[]);
    const fetchDrugs=async()=>{
        try{
            const res=await api.get("/drugs/");
            setDrugs(res.data);
        } catch(error){
            console.log(error);
        }
    };
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    const handleDispenseChange=(e)=>{
        setDispenseData({
            ...dispenseData,
            [e.target.name]:e.target.value
        });
    };
    const resetForm=()=>{
        setFormData({
            name:"",
            category:"",
            unit:"",
            buying_price:"",
            selling_price:"",
            quantity_in_stock:"",
            reorder_level:""
        });
    };
    const createDrug=async()=>{
        try{
            await api.post("/drugs/",formData);
            setShowAddModal(false);
            resetForm();
            fetchDrugs();
        } catch(error){
            console.log(error);
        }
    };
    const openEdit=(drug)=>{
        setSelectedDrug(drug);
        setFormData({
            name:drug.name,
            category:drug.category || "",
            unit:drug.unit || "",
            buying_price:drug.buying_price,
            selling_price:drug.selling_price,
            quantity_in_stock:drug.quantity_in_stock,
            reorder_level:drug.reorder_level
        });
        setShowEditModal(true);
    };
    const updateDrug=async()=>{
        try{
            await api.put(`/drugs/${selectedDrug.drug_id}`,
                formData
            );
            setShowEditModal(false);
            fetchDrugs();
        }
        catch(error){
            console.log(error);
        }
    };
    const openDispense=(drug)=>{
        setSelectedDrug(drug);
        setDispenseData({
            quantity:"",
            payment_method:"cash"
        });
        setShowDispenseModal(true);
    };
    const dispenseDrug=async()=>{
        try{
            await api.post("/pharmacy-sales/",{
                drug_id:selectedDrug.drug_id,
                quantity:Number(dispenseData.quantity),
                payment_method:dispenseData.payment_method
            });
            setShowDispenseModal(false);
            fetchDrugs();
        }
        catch(error){
            alert(
                error.response?.data?.detail ||
                "Dispensing failed"
            );
        }
    };
    return(
        <div className="p-6 bg-gray-100 min-h-screen">
            {/*HEADER*/}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Pharmacy Management
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage drugs,stock & dispensing
                    </p>
                </div>
                <button
                onClick={()=>setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    + Add Drug
                </button>
            </div>
            {/*TABLE*/}
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left text-sm">
                            <th className="p-3">Drug</th>
                            <th>Category</th>
                            <th>Unit</th>
                            <th>Buying</th>
                            <th>Selling</th>
                            <th>Stock</th>
                            <th>Reorder</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drugs.map((drug)=>(
                            <tr
                            key={drug.drug_id}
                            className="border-b text-sm">
                                <td className="p-3 font-medium">
                                    {drug.name}
                                </td>
                                <td>
                                    {drug.category}
                                </td>
                                <td>
                                    {drug.unit}
                                </td>
                                <td>
                                    KES {drug.buying_price}
                                </td>
                                <td>
                                    KES {drug.selling_price}
                                </td>
                                <td className={`font-semibold
                                ${
                                    drug.quantity_in_stock <=
                                    drug.reorder_level
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}>
                                    {drug.quantity_in_stock}
                                </td>
                                <td>
                                    {drug.reorder_level}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                        onClick={()=>openEdit(drug)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                            Edit
                                        </button>
                                        <button
                                        onClick={()=>openDispense(drug)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                                            Sell
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/*ADD MODAL*/}
            {showAddModal && (
                <Modal
                title="Add Drug"
                formData={formData}
                handleChange={handleChange}
                onClose={()=>setShowAddModal(false)}
                onSubmit={createDrug}
                buttonText="Create Drug"
                />
            )}
            {/*EDIT MODAL*/}
            {showEditModal && (
                <Modal
                title="Edit Drug"
                formData={formData}
                handleChange={handleChange}
                onClose={()=>setShowEditModal(false)}
                onSubmit={updateDrug}
                buttonText="Update Drug"
                />
            )}
            {/*DISPENSE MODAL*/}
            {showDispenseModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Dispense Drug
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm">
                                    Quantity
                                </label>
                                <input
                                type="number"
                                name="quantity"
                                value={dispenseData.quantity}
                                onChange={handleDispenseChange}
                                className="w-full border rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="text-sm">
                                    Payment Method
                                </label>
                                <select
                                name="payment_method"
                                value={dispenseData.payment_method}
                                onChange={handleDispenseChange}
                                className="w-full border rounded-lg px-3 py-2">
                                    <option value="cash">
                                        Cash
                                    </option>
                                    <option value="mpesa">
                                        M-Pesa
                                    </option>
                                    <option value="insurance">
                                        Insurance
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                            onClick={()=>setShowDispenseModal(false)}
                            className="border px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                            <button
                            onClick={dispenseDrug}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                                Dispense
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
function Modal({
    title,
    formData,
    handleChange,
    onClose,
    onSubmit,
    buttonText
}){
    return(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {title}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                    label="Drug Name"
                    name="name"
                    value={formData.name}
                    handleChange={handleChange}
                    />
                    <Input
                    label="Category"
                    name="category"
                    value={formData.category}
                    handleChange={handleChange}
                    />
                    <Input
                    label="Unit"
                    name="unit"
                    value={formData.unit}
                    handleChange={handleChange}
                    />
                    <Input
                    label="Buying Price"
                    name="buying_price"
                    type="number"
                    value={formData.buying_price}
                    handleChange={handleChange}
                    />
                    <Input
                    label="Stock Quantity"
                    name="quantity_in_stock"
                    type="number"
                    value={formData.quantity_in_stock}
                    handleChange={handleChange}
                    />
                    <Input
                    label="Reorder Level"
                    name="reorder_level"
                    type="number"
                    value={formData.reorder_level}
                    handleChange={handleChange}
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                    onClick={onClose}
                    className="border px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button
                    onClick={onSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
function Input({
    label,
    name,
    value,
    handleChange,
    type="text"
}){
    return(
        <div>
            <label className="text-sm">
                {label}
            </label>
            <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            />
        </div>
    );
}