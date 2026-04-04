import Sidebar from "../components/Sidebar";
import Navbar from "../components/Narvbar";
export default function DashboardLayout({children,user}) {
    return (
        <div className="flex min-h-screen bg-grey-100">
            {/*Sidebar*/}
            <Sidebar user={user}
            role={user?.role}
            hospitalId={user?.hospitalId}
            />
            {/*Main Section*/}
            <div className="flex flex-col flex-1 ">
                {/*Navbar*/}
                <Navbar user={user} />
                {/*Page Content*/}
                <main className="p-6 flex-1 ">
                    {children}
                </main>
            </div>
        </div>
    )
}