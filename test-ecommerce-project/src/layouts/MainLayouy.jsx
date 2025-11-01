import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayouy = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default MainLayouy;
