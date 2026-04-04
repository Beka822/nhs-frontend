import {Outlet} from "react-router-dom";
function Layout() {
    return (
        <div style={{backgroundColor: "#0f2c59",minHeight:"100vh",color:"white"}}>
            <header style={{textAlign:"center",padding:"20px"}}>
                <h1>National Health System Frontend</h1>
            </header>
            <main style={{padding: "20px"}}>
                <Outlet />
            </main>
        </div>
    );
}
export default Layout;