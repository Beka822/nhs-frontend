import { useEffect,useState } from "react";
import api from "../../api/axios";
import { LineChart,Line,XAxis,YAxis,Tooltip,
    ResponsiveContainer,PieChart,Pie,Cell,BarChart,Bar
 } from "recharts";
 const COLORS=["#2563eb","#16a34a","#dc2626","#f59e0b"];
 export default function PharmacyDashboard(){
    const [period,setPeriod]=useState("month");
    const [summary,setSummary]=useState({});
    const [profitTrend,setProfitTrend]=useState([]);
    const [topSelling,setTopSelling]=useState([]);
    const [payments,setPayments]=useState([]);
    const [trend,setTrend]=useState([]);
    const [lowStock,setLowStock]=useState([]);
    useEffect(()=>{
        fetchDashboard();
    },[period]);
    const fetchDashboard=async()=>{
        const summaryRes=await api.get(`/pharmacy-sales/summary?period=${period}`);
        const topRes=await api.get(`/pharmacy-sales/top-selling?period=${period}`);
        const paymentRes=await api.get(`/pharmacy-sales/payment-distribution?period=${period}`);
        const trendRes=await api.get(`/pharmacy-sales/revenue-trend?period=${period}`);
        const profitTrendRes=await api.get(`/pharmacy-sales/profit-trend?period=${period}`);
        const lowRes=api.get(`/pharmacy-sales/low-stock`);
        setSummary(summaryRes.data || []);
        setTopSelling(topRes.data || []);
        setPayments(paymentRes.data || []);
        setTrend(trendRes.data || []);
        setProfitTrend(profitTrendRes.data || []);
        setLowStock(lowRes.data || []);
    };
    return(
        <div className="p-6 bg-gray-100 min-h-screen">
            {/*HEADER*/}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Pharmacy Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Monitor pharmacy performance & inventory
                    </p>
                </div>
                <select value={period}
                onChange={(e)=>setPeriod(e.target.value)}
                className="border rounded-lg px-3 py-2 bg-white">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
            {/*KPI CARDS*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card title="Revenue"
                value={`KES ${summary.revenue || 0}`}
                insight="Total pharmacy revenue"
                />
                <Card title="Sales"
                value={summary.total_sales || 0}
                insight="Drugs sold"
                />
                <Card title="Profit"
                value={`KES ${summary.profit || 0}`}
                insight="Estimated pharmacy profit"
                />
                <Card title="Inventory Value"
                value={`KES ${summary.inventory_value || 0}`}
                insight="Current stock value"
                />
                <Card title="Low Stock"
                value={lowStock?.length || 0}
                danger={lowStock?.length > 0 || 0}
                />
            </div>
            {/*CHARTS*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
                {/*REVENUE TREND*/}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold mb-4">
                        Revenue Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trend}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563eb"
                            strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/*PROFIT TREND*/}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold mb-4">
                        Profit Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={profitTrend}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#16a34a"
                            strokeWidth={3}
                            /> 
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/*PAYMENT DISTRIBUTION*/}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold mb-4">
                        Payment Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                            data={payments}
                            dataKey="amount"
                            nameKey="method"
                            outerRadius={100}
                            label
                            >
                                {payments.map((entry,index)=>(
                                    <Cell 
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/*TOP SELLING*/}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <h3 className="font-semibold mb-4">
                    Top Selling Drugs
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={topSelling}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                        dataKey="revenue"
                        fill="#16a34a"
                        radius={[8,8,0,0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/*LOW STOCK*/}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold mb-4">
                    Low Stock Alerts
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2">Drug</th>
                                <th>Stock</th>
                                <th>Reorder Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock?.map((drug)=>(
                                <tr
                                key={drug.drug_id}
                                className="border-b">
                                    <td className="py-2">
                                        {drug.name}
                                    </td>
                                    <td className="text-red-600 font-medium">
                                        {drug.quantity_in_stock}
                                    </td>
                                    <td>
                                        {drug.reorder_level}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
 }
 function Card ({
    title,value,insight,danger
 }){
    return(
        <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm text-gray-500 mb-2">
                {title}
            </h3>
            <p className={`text-2xl font-bold ${
                danger ? "text-red-600" : ""
            }`}>
                {value}
            </p>
            <p className="text-xs text-gray-400 mt-2">
                {insight}
            </p>
        </div>
    );
 }