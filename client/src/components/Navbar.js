import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiDelete, requestError } from "../utils/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar({setOffline}) {

    //navigate hook
    const navigate = useNavigate();

    //function for logout
    const logOut = useCallback(() => {
        async function deleteLog() {
            setOffline();
            try {
                const { message } = await apiDelete("http://localhost:5000/user/login"); 
                toast.success(message, {
                    position: toast.POSITION.TOP_RIGHT
                })
                setTimeout(() => {
                    return navigate("/login");
                }, 3200);
            } catch(err) {
                if (err instanceof requestError && err.response.status === 500) {
                    toast.error(await err.response.text(), {
                        position: toast.POSITION.TOP_RIGHT
                    })
                } else  {
                    toast.error(await err.message, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                }
            }
            
        };
        deleteLog();
    })

    //output
    return (
        <div className="dashboard-navbar--container">
            <h3 className="dashboard-navbar--log-out" onClick={logOut}>Log out</h3>
            <ToastContainer autoClose={2000}/>    
        </div>
    )
}