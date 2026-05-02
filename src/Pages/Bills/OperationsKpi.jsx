import {useEffect,useState} from "react";
import api from "../../api/axios";
import{
    LineChart,Line,BarChart,Bar,XAxis,YAxis,
    Tooltip,ResponsiveContainer,CartesianGrid,
    PieChart,Pie,Cell,
} from "recharts";
export default function OperationsKpi(){
    const token=localStorage.getItem("token");
    const [period,setPeriod]=useState("month");
    const [data,setData]=useState({
        totalPatients:{},
        visitTrend:[],
        bedOccupancy:[],
        admissions:[],
        icu:{},
        los:[],
        transfers:[],
    });
    useEffect(()=>{
        fetchAll();
    },[period]);
    const fetchAll=async ()=>{
        try{
            const [
                totalPatients,
                visitTrend,
                bedOccupancy,
                admissions,
                icu,
                los,
                transfers,
            ]=await Promise.all([
                api.get(`/dashboard/patients`,{
                    headers:{Authorization: `Bearer ${token}`}
                }
                ),
                api.get(`/dashboard/visits-trend?
                    period=${period}`,{
                        headers:{Authorization: `Bearer ${token}`}
                    }),
                    api.get(`/dashboard/ward-bor-trend?
                        period=${period}`,{
                            headers:{Authorization: `Bearer ${token}`}
                        }),
                    api.get(`/dashboard/admission-discharge-trend?
                        period=${period}`,{
                            headers:{Authorization: `Bearer ${token}`}
                        }),
                    api.get(`/dashboard/icu-occupancy?
                        period=${period}`,{
                            headers:{Authorization: `Bearer ${token}`}
                        }),
                    api.get(`/dashboard/los-analytics?
                        period=${period}`,{
                            headers:{Authorization: `Bearer ${token}`}
                        }),
                    api.get(`/dashboard/top-transfer-reasons?year=2026&month=5`,{
                        headers:{Authorization: `Bearer ${token}`}
                    }),
            ]);
            setData({
                totalPatients: totalPatients.data,
                visitTrend: visitTrend.data,
                bedOccupancy: bedOccupancy.data,
                admissions: admissions.data,
                icu: icu.data,
                los: los.data,
                transfers: transfers.data,
            });
        } catch (err) {
            console.error(err);
        }
    };
    const getICUColor=(rate)=>{
        if(rate >=90) return "text-red-600";
        if(rate >=75) return "text-yellow-600";
        return "text-green-600";
    };
    //Derived values
    const latestVisit=
    data.visitTrend.at(-1)?.total || 0;
    const latestOccupancy=
    data.bedOccupancy.at(-1)?.occupancy_rate || 0;
    const totalNetFlow=data.admissions.reduce(
        (acc,row)=>acc + (row.net_flow || 0),0
    );
    return(
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/*HEADER*/}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Hospital Overview</h1>
                    <p className="text-gray-500 text-sm">
                        Real-time operational insights
                    </p>
                </div>
                <select
                className="border rounded-lg px-3 py-2"
                value={period}
                onChange={(e)=>
                    setPeriod(e.target.value)
                }>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
            {/*TOP CARDS*/}
            <div className="grid grid-cols-4 gap-4">
                <Card
                title="Total Patients"
                value={data.totalPatients.today || 0}
                sub={`Week: ${data.totalPatients.week || 0} | 
                Month: ${data.totalPatients.month || 0}`}
                insight="Overal patient volume"/>
                <Card
                title="Daily visits"
                value={latestVisit}
                sub="Latest day"
                insight="Tracks patient flow" />
                <Card
                title="Bed Occupancy"
                value={`${latestOccupancy}%`}
                sub="Across wards"
                insight="Hospital capacity usage" />
                <Card
                title="ICU Occupancy"
                value={
                    <span
                    className={getICUColor(data.icu?.current?.rate || 0)}>
                        {data.icu?.current?.rate || 0}%
                    </span>}
                sub={`${data.icu?.current?.occupied || 0}/${data.icu?.current?.total || 0}`}
                insight={data.icu?.alert?.message || "Normal"} />
            </div>
            {/*CHARTS ROW*/}
            <div className="grid grid-cols-3 gap-4">
                {/*VISIT TREND
                <ChartBox title="Daily Visits">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data.visitTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone"
                            dataKey="total" stroke="#3b82f6" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartBox>*/}
                {/*ADMISSIONS*/}
                <ChartBox title="Admissions vs Discharges">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.admissions}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="admissions" fill="#10b981" />
                            <Bar dataKey="discharges" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartBox>
                {/*ICU TREND*/}
                <ChartBox title="ICU Occupancy Trend">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data.icu?.trend || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line dataKey="rate" stroke="#f59e0b" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartBox>
            </div>
            {/*SECOND ROW*/}
            <div className="grid grid-cols-2 gap-4">
                {/*TRANSFER PIE*/}
                <ChartBox title="Transfer Reasons">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                            data={data.transfers}
                            dataKey="percentage"
                            nameKey="reason"
                            outerRadius={80}>
                                {data.transfers.map((_,i)=>
                                (
                                    <Cell key={i} />
                                ))} 
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartBox>
                {/*LOS*/}
                <ChartBox title="Length of Stay">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.los}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ward" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="median_los" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartBox>
            </div>
        
            {/*MIDDLE SECTION*/}
            <div className="grid grid-cols-3 gap-4">
                {/*Admissions*/}
                <Box title="Admissions vs Discharges">
                    <div className="text-xl font-semibold">
                        Net Flow: {totalNetFlow}
                    </div>
                    <p className="text-sm text-gray-500">
                        Positive = more admissions
                    </p>
                </Box>
                {/*LOS*/}
                <Box title="Length of Stay">
                    <div className="text-3xl font-bold">
                        {data.los?.[0]?.median_los || 0} days
                    </div>
                    <p className="text-sm text-gray-500">
                        Efficiency: {data.los?.[0]?.efficiency_score || 0}
                    </p>
                </Box>
                {/*Transfer*/}
                <Box title="Transfer Reasons">
                    {data.transfers.map((r,i)=>(
                        <div key={i} className="flex justify-between text-sm">
                            <span>{r.reason}</span>
                            <span>{r.percentage}%</span>
                        </div>
                    ))}
                </Box>
            </div>
            {/*BOTTOM*/}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-medium mb-2">Daily Visit Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.visitTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<VisitTooltip />} />
                        <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                    <p className="text-sm text-gray-500 mt-2">
                        Helps forecast demand patterns
                    </p>
                </div>
            </div>
    );
}
/*CARD*/
function Card({title,value,sub,insight}){
    return(
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <div className="text-2xl font-semibold mt-2">{value}</div>
            <div className="text-sm text-gray-400">{sub}</div>
            <div className="mt-3 text-xs bg-gray-100 p-2 rounded">{insight}</div>
        </div>
    );
}
/*BOX*/
function Box({title,children}){
    return(
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-medium mb-2">{title}</h3>
            {children}
            <div className="mt-3 text-xs bg-gray-100 p-2 rounded">
                Insight summary
            </div>
        </div>
    );
}
/*CHART BOX*/
function ChartBox({title,children}){
    return(
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="mb-2 font-medium">{title}</h3>
            {children}
        </div>
    );
}
/*TOOLTIP*/
function VisitTooltip({active,payload,label}){
    if (active && payload && payload.length){
        const value=payload[0].value;
        let insightt="Normal day";
        if (value >150) insight="High patient volume";
        else if (value<50) insight="Low patient turnout";
        return(
            <div className="bg-white p-3 border rounded shadow text-sm">
                <p className="font-medium">{label}</p>
                <p>Visits: {value}</p>
                <p className="text-gray-500">{insight}</p>
            </div>
        );
    }
    return null;
}