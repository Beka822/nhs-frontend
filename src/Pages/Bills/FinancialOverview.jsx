import {useEffect,useState} from "react";
import api from "../../api/axios";
import {ResponsiveContainer,PieChart
    Pie,Cell,Tooltip,Legend,LineChart,Line,
    XAxis,YAxis,CartesianGrid,BarChart,Bar
} from "recharts";
const COLORS=["#3b82f6","#10b981","#f59e0b","#ef4444","#6366f1"];
export default function FinancialOverview(){
    const [period,setPeriod]=useState("month");
    const [data,setData]=useState({
        distribution:[],
        trend:[],
        digital_vs_cash: 0,
        topServices:[]
    });
    useEffect(()=>{
        fetchData();
    },[period]);
    const fetchData=async ()=>{
        try{
            const [payments,services]=await Promise.all([
                api.get(`/dashboard/payment-analytics?period=${period}`,{
                    headers:{Authorization: `Bearer ${token}`}
                }),
                api.get(`/dashboard/top-services?period=${period}`,{
                    headers:{Authorization: `Bearer ${token}`}
                })
            ]);
            setData({
                ...payments.data,
                topServices:services.data
            });
        } catch (err) {
            console.error(err);
        }
    };
    {/*INSIGHTS*/}
    const totalRevenue=data.trend.reduce((a,b)=>a + b.revenue,0);
    const topMethod=data.distribution.sort((a,b)=>b.amount - a.amount)[0];
    let insight="Balanced payment distribution";
    if (topMethod) {
        if (topMethod.method === "Cash") insight="High cash usage - fraud risk";
        if (topMethod.method === "M-Pesa") insight="Strong digital adoption";
        if (topMethod.method === "Insurance") insight="High insurance dependency";
    }
    {/*ALERTS*/}
    let alert=null;
    if(data.insurance_dependency > 70){
        alert="Over-dependency on insurrance";
    } else if (data.insurance_dependency < 20){
        alert="Low insurance coverage";
    }
    return(
        <div className="p-4 space-y-6">
            {/*HEADER*/}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Financial Analytics</h2>
                <select
                value={period}
                onChange={(e)=>setPeriod(e.target.value)}
                className="border p-2 rounded">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
            {/*ALERT*/}
            {alert && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                    {alert}
                </div>
            )}
            {/*TOP CARDS*/}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h3>Total Revenue</h3>
                    <p className="text-xl font-bold">Ksh {totalRevenue.toFixed(0)}</p>
                    <p className="text-sm text-gray-500">Revenue for selected period</p>
                </div>
            <div className="bg-white p-4 rounded shadow">
                <h3>Insurance Dependency</h3>
                <p className="text-xl font-bold">{data.insurance_dependency}%</p>
                <p className="text-sm text-gray-500">% revenue from insurance</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h3>Insight</h3>
                <p className="text-sm">{insight}</p>
            </div>
        </div>
        {/*CHARTS GRID*/}
        <div className="grid grid-col-2 gap-6">
            {/*PIE: PAYMENT DISTRIBUTION*/}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="mb-2">Payment Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                        data={data.distribution}
                        dataKey="percentage"
                        nameKey="method"
                        cx="40%"
                        outerRadius={80}
                        label
                        >
                            {data.distribution.map((_,i)=>(
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/*LINE: REVENUE TREND*/}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="mb-2">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/*DIGITAL VS CASH*/}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="mb-2">Digital vs Cash</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.digital_vs_cash}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#10b981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/*INSURANCE DEPENDENCY VISUAL*/}
            <div className="bg-white p-4 rounded shadow flex flex-col justify-center items-center">
                <h3>Insurance Dependency</h3>
                <p className="text-3xl font-bold">{data.insurance_dependency}%</p>
                <p className="text-sm text-gray-500">Reliance on insurance payments</p>
            </div>
            {/*TOP SERVICES*/}
            <div className="bg-white p-4 rounded shadow col-span-2">
                <h3 className="mb-2">Top Services</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topServices}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
    )

}