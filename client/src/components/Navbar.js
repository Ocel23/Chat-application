import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiDelete, apiGet, requestError } from "../utils/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showServerError from "../utils/showServerError";

export default function Navbar({setOffline}) {

    //navigate hook
    const navigate = useNavigate();

    //satte for get user data
    const [userEmail, setUserEmail] = useState();

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

    //get user data
    useEffect(() => {
        async function getUser() {
            try {
                const data = await apiGet("http://localhost:5000/user/login");
                setUserEmail(data.email);
            } catch(err) {
                if (err instanceof requestError) {
                    showServerError(await err.response.text())    
                } else {
                    showServerError(await err.message);
                }
            }
        }
        getUser();
    }, [])

    //output
    return (
        <nav className="dashboard-navbar--container">
            <h3 className="dashboard-navbar--email">{userEmail}</h3>
            <span className="dashboard-navbar--spacer"></span>
            <h3 className="dashboard-navbar--log-out" onClick={logOut}>Log out</h3>
            <ToastContainer autoClose={2000}/>    
        </nav>
    )
}