
import { useEffect,useState } from "react";
import Login from "./Pages/Login";
import Hospitals from "./Pages/Hospitals/Hospitals"
import HospitalDetail from "./Pages/Hospitals/HospitalDetail";
import CreateHospital from "./Pages/Hospitals/CreateHospital";
import Users from "./Pages/Users/Users";
import CreateUser from "./Pages/Users/CreateUser";
import Wards from "./Wards/ward";
import Beds from "./Pages/Beds/Beds";
import CreateBed from "./Pages/Beds/CreateBed";
import PatientSearch from "./Patient/PatientSearch";
import PatientDetail from "./Patient/PatientDetail";
import CreatePatient from "./Patient/CreatePatient";
import VisitDetail from "./Visits/VisitDetail";
import CreateVisit from "./Visits/CreateVisit";
import CreateVisitAddendum from "./Visits/CreateVisitAddendum";
import CreateAdmission from "./Visits/CreateAdmission";
import ActiveAdmissions from "./Visits/ActiveAdmissions";
import TransferBed from "./Visits/TransferBed";
import DischargePatient from "./Visits/DischargePatient";
import BillsPage from "./Pages/Bills/BillsPage";
import BillDetail from "./Pages/Bills/BillDetail";
import DashboardLayout from "./Layout/DashboardLayout";
import api from "./api/axios";
import {Routes,Route,Navigate} from "react-router-dom";
import CreateWards from "./Wards/CreateWards";
function App() {
  const [user,setUser]=useState(null)
  const getCurrentUser=async()=>{
    const token=localStorage.getItem("access_token");
    if (!token) return;
    try{
      const res=await api.get("/users/users/me");
      console.log("APP USER:",res.data);
      setUser(res.data);
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    getCurrentUser()
  },[])
  return(
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      {/*LOGIN*/}
      <Route path="/login" element={<Login />} />
      {/*HOSPITALS*/}
      <Route path="/hospitals" element={<DashboardLayout
        user={user}>
          <Hospitals
          user={user} />
        </DashboardLayout>
      }
      />
      <Route path="/create-hospital" element={<DashboardLayout user={user}>
        <CreateHospital />
      </DashboardLayout>}
      />
      {/*HOSPITAL DETAIL*/}
      <Route path="/hospitals/:hospital_id" element={<DashboardLayout
        user={user}>
          <HospitalDetail
          user={user} />
        </DashboardLayout>
      }
      />
      {/*USERS*/}
      <Route path="/hospitals/:hospital_id/users"element={<DashboardLayout
        user={user}>
          <Users
          user={user} />
        </DashboardLayout>
      }
      />
      <Route path="/hospitals/:hospital_id/users/create"
      element={
        <DashboardLayout user={user}>
          <CreateUser />
        </DashboardLayout>
      }
      />
      {/*WARDS*/}
      <Route path="/hospitals/:hospital_id/wards" element={
        <DashboardLayout user={user}>
          <Wards />
        </DashboardLayout>
      } />
      <Route path="/hospitals/:hospital_id/wards/create" element={
        <DashboardLayout user={user}>
          <CreateWards />
        </DashboardLayout>
      } />
      <Route path="/hospitals/:hospital_id/wards/:ward_id/beds" element={
        <DashboardLayout user={user}>
          <Beds />
        </DashboardLayout>
      } />
      <Route path="/hospitals/:hospital_id/wards/:ward_id/beds/create"
      element={
        <DashboardLayout user={user}>
          <CreateBed />
        </DashboardLayout>
      } />
      <Route path="/patients/search" element={
        <PatientSearch />
      } />
      <Route path="/patients/register" element={
        <DashboardLayout user={user}>
          <CreatePatient />
        </DashboardLayout>
      } />
      <Route path="/patients/:patient_id" element={<PatientDetail />} />
      <Route path="/visits/:patient_id/:visit_id" element={
        <DashboardLayout user={user}>
          <VisitDetail />
        </DashboardLayout>
      } />
      <Route path="/patients/:patient_id/visits/create" element={
        <DashboardLayout user={user}>
          <CreateVisit />
        </DashboardLayout>
      } />
      <Route path="/visits/:patient_id/:visit_id/addendum/create" element={
        <DashboardLayout user={user}>
          <CreateVisitAddendum />
        </DashboardLayout>
      } />
      <Route path="/patients/:patient_id/visits/:visit_id/admit" element={
        <DashboardLayout user={user}>
          <CreateAdmission />
        </DashboardLayout>
      }/>
      <Route path="/active-admissions" element={
        <DashboardLayout user={user}>
          <ActiveAdmissions />
        </DashboardLayout>
      } />
      <Route path="/transfer-bed/:admission_id" element={
        <DashboardLayout user={user}>
          <TransferBed/>
        </DashboardLayout>
      }/>
      <Route path="/discharge/:admission_id" element={
        <DashboardLayout user={user}>
          <DischargePatient/>
        </DashboardLayout>
      }/>
      <Route path="/hospital/:hospital_id/bills" element={
        <DashboardLayout user={user}>
          <BillsPage />
        </DashboardLayout>
      } />
      <Route path="/bills/:bill_id" element={
        <DashboardLayout user={user}>
          <BillDetail />
        </DashboardLayout>
      } />
    </Routes>
  )
}
export default App;


