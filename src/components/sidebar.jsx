import {Link,useLocation} from "react-router-dom";
import { FaHome,FaHospital,FaUsers,FaBed,FaHandHoldingUsd,FaChartLine,FaUserInjured,FaProcedures,FaFileInvoiceDollar } from "react-icons/fa";
const Sidebar=()=>{
    const role=localStorage.getItem("role");
    const hospital_id=localStorage.getItem("hospital_id");
    const isActive=(path)=>location.pathname===path;
    const linkClass=(path)=>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive(path)
            ? "bg-white/10 text-white border-l-4 border-white"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`;
        return(
            <div className="w-64  min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white shadow-2xl flex flex-col ">
                {/*LOGO*/}
                <div>
                    <div className="p-5 text-2xl font-bold tracking-wide border-b border-white/10">
                        Health System
                    </div>
                    {/*NAVIGATION*/}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {/*SUPER ADMIN*/}
                        {role === "SUPER_ADMIN" && (
                            <Link to="/hospitals"
                            className={linkClass("/hospitals")}>
                                <FaHospital  className="text-lg"/> 
                                <span>Hospitals</span>
                            </Link>
                        )}
                        {/*HOSPITAL USERS*/}
                        {role !== "SUPER_ADMIN" && (
                            <>
                            <Link to="/hospitals/:hospital_id/users"
                            className={linkClass("/users")}>
                                <FaUsers className="text-lg" /> 
                                <span>Users</span>
                            </Link>
                            <Link to="/hospitals/:hospital_id/wards"
                            className={linkClass("/wards")}>
                                <FaBed text-lg /> 
                                <span>Wards</span>
                            </Link>
                            <Link to="/patients/search"
                            className={linkClass("/patients")}>
                                <FaUserInjured className="text-lg" /> 
                                <span>Patients</span>
                            </Link>
                            <Link to="/active-admissions"
                            className={linkClass("/admissions")}>
                                <FaProcedures className="text-lg"/> 
                                <span>Admissions</span>
                            </Link>
                            <Link to="/hospitals/:hospital_id/bills"
                            className={linkClass("/bills")}>
                                <FaFileInvoiceDollar  className="text-lg"/> 
                                <span>Bills & Payments</span>
                            </Link>
                            <Link to="/hospitals/:hospital_id/dashboard"
                            className={linkClass("/dashboard")}>
                                <FaChartLine className="text-lg"/>
                                <span> Operations KPIs</span>
                            </Link>
                            <Link to="/hospitals/:hospital_id/finance"
                            className={linkClass("/finance")}>
                                <FaHandHoldingUsd className="text-lg" />
                                <span> Financial Overview</span>
                            </Link>
                            <Link to="/hospitals/:hospital_id/payout"
                            className={linkClass("/payout")}>
                            <FaFileInvoiceDollar text-lg/>
                            <span>Payouts</span>
                            </Link>
                            </>
                        )}
                    </nav>
                </div>
                {/*Footer*/}
                <div className="p-4 border-t border-white/10 text-sm bg-white/5 backdrop-blur mt-auto">
                   &copy; Universal Electronic Health System
                </div>
            </div> 
        );
};
export default Sidebar;