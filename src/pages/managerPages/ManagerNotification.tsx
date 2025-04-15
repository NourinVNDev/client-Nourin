import { Toaster } from "react-hot-toast";
import Header from "../../components/managerComponents/Header";
import NavBar from "../../components/managerComponents/NavBar";
import Footer from "../../components/managerComponents/Footer";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../App/store";
import { fetchManagerNotification } from "../../service/managerServices/handleNotification";
const ManagerNotification=()=>{
    const managerId=useSelector((state:RootState)=>state.manager._id);
    useEffect(()=>{
        const ManagerNotification=async()=>{
            if(managerId){
                const result=await fetchManagerNotification(managerId);
                console.log(result);
            }

        }
ManagerNotification()
    },[managerId])
    return(
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header/>
            <Toaster position="top-center"/>
            <div className="flex flex-1">
                <NavBar/>
                <div className="flex-1 p-5">
                    <br />

                </div>
            </div>
            <Footer/>
        </div>
    )

}
export default ManagerNotification;