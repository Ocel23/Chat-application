import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { apiDelete, apiGet, requestError } from "../utils/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showServerError from "../utils/showServerError";

export default function Navbar({setOffline}) {

    //navigate hook
    const navigate = useNavigate();

    const navigation = useNavigation()

    //satte for get user data
    const [userEmail, setUserEmail] = useState();

    //nodejs api address
    const API_URL = process.env.REACT_APP_NODEJS_ADDRESS;

    //function for logout
    const logOut = () => {
        async function deleteLog() {
            setOffline();
            try {
                
                const { message } = await apiDelete(`${API_URL}/user/login`); 
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
    }

    //get user data
    useEffect(() => {
        async function getUser() {
            try {
                const data = await apiGet(`${API_URL}/user/login`);
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
            <button className="dashboard-navbar--log-out" onClick={logOut} disabled={navigation.state == "submitting"}>{navigation.state === "submitting" ? "Loging out..." : "Log out"}</button>
            <ToastContainer autoClose={2000}/>    
        </nav>
    )
}