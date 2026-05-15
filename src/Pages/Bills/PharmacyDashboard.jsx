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
    const [nearExpiry,setNearExpiry]=useState([]);
    const [expiredDrugs,setExpiredDrugs]=useState([]);
    const [inventoryAtRisk,setInventoryAtRisk]=useState([]);
    const [topSelling,setTopSelling]=useState([]);
    const [intelligence,setIntelligence]=useState(null);
    const [payments,setPayments]=useState([]);
    const [trend,setTrend]=useState([]);
    const [lowStock,setLowStock]=useState([]);
    useEffect(()=>{
        fetchDashboard();
    },[period]);
    const fetchDashboard=async()=>{
        const intelligenceRes=await api.get("/intelligence/")
        const summaryRes=await api.get(`/pharmacy-sales/summary?period=${period}`);
        const topRes=await api.get(`/pharmacy-sales/top-selling?period=${period}`);
        const paymentRes=await api.get(`/pharmacy-sales/payment-distribution?period=${period}`);
        const trendRes=await api.get(`/pharmacy-sales/revenue-trend?period=${period}`);
        const profitTrendRes=await api.get(`/pharmacy-sales/profit-trend?period=${period}`);
        const nearExpiryRes=await api.get("/drugs/near-expiry");
        const expiredRes=await api.get("/drugs/expired");
        const riskRes=await api.get("/drugs/expiring-value");
        const lowRes=api.get(`/pharmacy-sales/low-stock`);
        setSummary(summaryRes.data || []);
        setIntelligence(intelligenceRes.data || []);
        setTopSelling(topRes.data || []);
        setPayments(paymentRes.data || []);
        setTrend(trendRes.data || []);
        setProfitTrend(profitTrendRes.data || []);
        setNearExpiry(nearExpiryRes.data || []);
        setExpiredDrugs(expiredRes.data || []);
        setInventoryAtRisk(riskRes.data || []);
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
            {intelligence && (
                <div className="space-y-4 mb-6">
                    <InsightCard
                    title="Inventory Loss Risk"
                    severity="warning"
                    problem={`${intelligence.inventory_loss_risk.count}
                    products are overstocked relative to demand`}
                    impact={`KES ${intelligence.inventory_loss_risk.financial_exposure}
                    tied in excess inventory`}
                    action={intelligence.inventory_loss_risk.recommended_action}
                    />
                    <InsightCard
                    title="Expiry Exposure"
                    severity="danger"
                    problem={`${intelligence.expiry_exposure.count}
                    products may expire within 45 days`}
                    impact={`KES ${intelligence.expiry_exposure.financial_exposure}
                    at risk`}
                    action={intelligence.expiry_exposure.recommended_action}
                    />
                    <InsightCard
                    title="Revenue Leakage"
                    severity="warning"
                    problem={`${intelligence.revenue_leakage.count}
                    high-volume products
                    have low margins`}
                    impact={`Estimated monthly loss:
                        KES ${intelligence.revenue_leakage.estimated_loss}`}
                    action={intelligence.revenue_leakage.recommended_action}
                    />
                    <InsightCard
                    title="Stock-out Prediction"
                    severity="danger"
                    problem={`${intelligence.stockout_predictions.count}
                    products may run out soon`}
                    impact={intelligence.stockout_predictions.items?.[0]
                        ?
                        `Highest risk: ${intelligence.stockout_predictions.items[0].drug}
                        (${intelligence.stockout_predictions.items[0].days_left}
                        days left)`
                        :
                        "No immediate stock-out risk"
                    }
                    action={intelligence.stockout_predictions.recommended_action}
                    />
                </div>

            )}
            {/*KPI CARDS*/}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card title="Revenue"
                value={`KES ${summary.revenue || 0}`}
                insight="Total pharmacy revenue"
                />
                <Card title="Sold"
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
                <Card title="Inventory At Risk"
                value={`KES ${inventoryAtRisk?.reduce((sum,item)=>sum + item.inventory_value,0)?.toFixed(0) || 0}`}
                insight="Stock nearing expiry"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/*NEAR EXPIRY*/}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 min-h-[140px]">
                        <div className="flex items-start gap-3 mb-2">
                            <span className="text-yellow-600 text-3xl">

                            </span>
                            <h3 className="font-semibold text-yellow-800 text-lg mb-2 break-words">
                                Expiry Warning
                            </h3>
                        </div>
                        <p className="text-sm text-yellow-700 leading-relaxed break-words">
                            {nearExpiry?.length || 0}
                            {""}
                            drugs expire within 30 days
                        </p>
                    </div>
                    {/*EXPIRED*/}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 min-h-[140px]">
                        <div className="flex items-start gap-3 mb-2">
                            <span className="text-red-600 text-3xl">
                                X
                            </span>
                            <h3 className="font-semibold text-red-800 text-lg mb-2 break-words">
                                Expired Drugs
                            </h3>
                        </div>
                        <p className="text-sm text-red-700 leading-relaxed break-words">
                            {expiredDrugs?.length || 0}
                            {""}
                            drugs already expired
                        </p>
                    </div>
                </div>
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
            {/*INVENTORY AT RISK BAR CHART*/}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="mb-4">
                    <h3 className="font-semibold">
                        Inventory At Risk
                    </h3>
                    <p className="text-sm text-gray-500">
                        Highest value drugs nearing expiry
                    </p>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={inventoryAtRisk}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="inventory_value"
                        fill="#dc2626"
                        radius={[8,8,0,0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
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
            {/*EXPIRY TABLE*/}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-semibold">
                            Near Expiry Inventory
                        </h3>
                        <p className="text-sm text-gray-500">
                            Drugs requiring urgent attention
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-sm">
                                <th className="py-3">
                                    Drug
                                </th>
                                <th>
                                    Stock
                                </th>
                                <th>
                                    Expiry Date
                                </th>
                                <th>
                                    Days Remaining
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {nearExpiry?.map((drug,index)=>(
                                <tr
                                key={index}
                                className="border-b text-sm">
                                    <td className="py-3 font-medium">
                                        {drug.name}
                                    </td>
                                    <td>
                                        {drug.quantity_in_stock}
                                    </td>
                                    <td>
                                        {drug.expiry_date}
                                    </td>
                                    <td>
                                        <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium
                                            ${
                                                drug.days_remaining <= 7
                                                ? "bg-red-100 text-red-700"
                                                :drug.days_remaining <= 30
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                            >
                                                {drug.days_remaining} days
                                            </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
 function InsightCard({
    title,
    problem,impact,action,severity
 }){
    const colors={
        warning:"border-yellow-400 bg-yellow-50",
        danger:"border-red-400 bg-red-50",
        success:"border-green-400 bg-green-50"
    };
    return(
        <div
        className={`border-l-4 rounded-xl p-5 shadow-sm ${colors[severity]}`}
        >
            <h3 className="text-lg font-bold mb-2">
                {title}
            </h3>
            <p className="text-gray-700 mb-2">
                <span className="font-semibold">
                    Problem:
                </span>
                {""}
                {problem}
            </p>
            <p className="text-gray-700 mb-2">
                <span className="font-semibold">
                    Financial Impact:
                </span>
                {""}
                {impact}
            </p>
            <p className="text-gray-700">
                <span className="font-semibold">
                    Recommended Action:
                </span>
                {""}
                {action}
            </p>
        </div>
    );
 }